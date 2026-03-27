// config/db.go

package config

import (
    "context"
    "log"
    "os"
    "time"

    "github.com/joho/godotenv"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Client

func ConnectDB() {
    godotenv.Load()

    uri := os.Getenv("MONGO_URI")

    client, err := mongo.NewClient(options.Client().ApplyURI(uri))
    if err != nil {
        log.Fatal(err)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    err = client.Connect(ctx)
    if err != nil {
        log.Fatal(err)
    }

    DB = client
}

func GetDBName() string {
    return os.Getenv("DB_NAME")
}