package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/KumKeeHyun/toiot/health-check/dataService/memory"
	"github.com/KumKeeHyun/toiot/health-check/usecase/healthCheckUC"
	"github.com/KumKeeHyun/toiot/health-check/usecase/websocketUC"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func main() {
	sr := memory.NewStatusRepo()

	event := make(chan interface{}, 10)
	_ = healthCheckUC.NewHealthCheckUsecase(sr, event)

	wu := websocketUC.NewWebsocketUsecase(event)

	r := gin.New()

	r.GET("/health-check", func(c *gin.Context) {
		listen := make(chan interface{})
		wu.Register(listen)
		defer wu.Unregister(listen)

		conn, err := websocket.Upgrade(c.Writer, c.Request, nil, 1024, 1024)
		if err != nil {
			log.Printf("upgrade: %s", err.Error())
		}
		fmt.Println("connect websocket!")

		for data := range listen {
			conn.WriteJSON(data)
		}
		fmt.Println("disconnect websocket!")
	})

	go log.Fatal(r.Run(":8085"))

	sigterm := make(chan os.Signal, 1)
	signal.Notify(sigterm, syscall.SIGINT, syscall.SIGTERM)
	<-sigterm

}
