package main

import (
	"log"
	"net"
	"net/http"
	"os"

	"google.golang.org/grpc"
	pb "github.com/YouKnowZo/Meta_The_World/services/bridge/proto"
	"github.com/YouKnowZo/Meta_The_World/services/bridge/internal/server"
	"github.com/YouKnowZo/Meta_The_World/services/bridge/internal/spatial"
	"github.com/YouKnowZo/Meta_The_World/services/bridge/internal/state"
)

func main() {
	redisAddr := os.Getenv("REDIS_URL")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	grpcPort := os.Getenv("GRPC_PORT")
	if grpcPort == "" {
		grpcPort = "50051"
	}

	wsPort := os.Getenv("WS_PORT")
	if wsPort == "" {
		wsPort = "8080"
	}

	// Initialize components
	redisProvider := state.NewRedisProvider(redisAddr)
	s2Manager := spatial.NewS2Manager(12)

	// Start gRPC server
	lis, err := net.Listen("tcp", ":"+grpcPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	bridgeServer := server.NewBridgeServer(redisProvider, s2Manager)
	pb.RegisterBridgeServiceServer(s, bridgeServer)

	go func() {
		log.Printf("Starting gRPC server on port %s", grpcPort)
		if err := s.Serve(lis); err != nil {
			log.Fatalf("failed to serve gRPC: %v", err)
		}
	}()

	// Start WebSocket server
	wsHandler := server.NewWSHandler(redisProvider)
	http.HandleFunc("/ws", wsHandler.Handle)
	
	// Add health check
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	log.Printf("Starting WebSocket server on port %s", wsPort)
	if err := http.ListenAndServe(":"+wsPort, nil); err != nil {
		log.Fatalf("failed to serve WebSocket: %v", err)
	}
}
