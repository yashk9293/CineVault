package main

import (
	"log"
	"net/http"
	"os"

	"movie-app/config"
	"movie-app/routes"
	"movie-app/middleware"

	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"
)

func main() {
	config.ConnectDB()

	r := mux.NewRouter()

	r.Use(middleware.Logger)

	routes.MovieRoutes(r)
	routes.AuthRoutes(r)
	routes.DashboardRoutes(r)

	// CORS Configuration
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}), // Baad mein yahan Vercel ka URL daal sakte ho
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	// 🚀 Dynamic Port for Deployment
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000" // Local ke liye 5000 use karega
	}

	log.Println("Server running on port " + port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler(r)))
}