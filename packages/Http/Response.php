<?php

namespace Packages\Http;

use JetBrains\PhpStorm\NoReturn;

class Response
{
    /**
     * Return JSON response
     */
    #[NoReturn]
    public static function json($data, int $statusCode = 200): void
    {
        http_response_code($statusCode);

        header('Content-Type: application/json; charset=utf-8');

        echo json_encode(
            $data,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        exit;
    }

    /**
     * Return success response
     */
    #[NoReturn]
    public static function success($data = null, string $message = 'Success', int $statusCode = 200): void
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    /**
     * Return error response
     */
    #[NoReturn]
    public static function error(string $message = 'Error', int $statusCode = 400, $data = null): void
    {
        self::json([
            'success' => false,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }
}