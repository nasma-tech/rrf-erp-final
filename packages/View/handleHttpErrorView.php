<?php

namespace Packages\View;

use JetBrains\PhpStorm\NoReturn;

class handleHttpErrorView
{
    private const array PAGES = [
        401 => 'templates/401.tpl',
        403 => 'templates/403.tpl',
        404 => 'templates/404.tpl',
        422 => 'templates/422.tpl',
        500 => 'templates/500.tpl',
    ];

    #[NoReturn]
    public static function handle(int $code, array|string $errorText = []): void
    {
        $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
            && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

        if ($isAjax) {
            http_response_code($code);

            header('Content-Type: application/json; charset=utf-8');

            echo json_encode([
                'success' => false,
                'errorCode' => $code,
                'errorText' => $errorText,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            exit;
        }

        $page = self::PAGES[$code] ?? self::PAGES[500];

        if (!file_exists(__SOURCE__ . 'view/' . $page)) {
            http_response_code(500);
            $page = self::PAGES[500];
        } else {
            http_response_code($code);
        }

        view->ui([], [], [
            'errorText' => $errorText,
            'errorCode' => $code,
        ])->display($page);

        exit;
    }
}