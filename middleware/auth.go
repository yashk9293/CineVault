package middleware

import (
    "context"
    "net/http"
    "os"
    "strings"

    "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")

        if authHeader == "" {
            http.Error(w, "Unauthorized", 401)
            return
        }

        tokenString := strings.Split(authHeader, " ")[1]

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Invalid token", 401)
            return
        }

        claims := token.Claims.(jwt.MapClaims)
        userId := claims["userId"].(string)

        ctx := context.WithValue(r.Context(), "userId", userId)

        next.ServeHTTP(w, r.WithContext(ctx))
    })
}