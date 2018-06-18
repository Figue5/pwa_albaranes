<?php

if(strtoupper($_SERVER['REQUEST_METHOD']) === 'OPTIONS'){
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: *");
    return;
}

$action = $_SERVER['PATH_INFO'] ?? "";
// die($action);

$actions = [
    '/check' => function(){
        // return ['status' => 'ok'];
        return [];
    },
    '/mcv/AlbaranesMaterial/obtenerActuacionesAbiertas' => function(){
        return [
            [
                'id' => 11,
                'descripcion' => 'Actuación 1',
            ],
            [
                'id' => 12,
                'descripcion' => 'Actuación 2',
            ],
            [
                'id' => 13,
                'descripcion' => 'Actuación 3',
            ]
        ];
    },
    '/mcv/AlbaranesMaterial/obtenerArticulos' => function(){
        return [
            [
                'id' => 11,
                'referencia' => 'ref1',
                'descripcion' => 'Producto 1',
                'codigo_barras' => 'a'
            ],
            [
                'id' => 12,
                'referencia' => 'ref2',
                'descripcion' => 'Producto 2',
                'codigo_barras' => 'b'
            ],
            [
                'id' => 13,
                'referencia' => 'ref3',
                'descripcion' => 'Producto 3',
                'codigo_barras' => 'c'
            ]
        ];
    },
    '/mcv/AlbaranesMaterial/obtenerAlmacenes' => function(){
        return [
            1 => 'Almacen 1',
            2 => 'Almacen 2',
            3 => 'Almacen 3'
        ];
    },
    '/mcv/AlbaranesMaterial/crearAlbaranMaterial' => function(){
        file_put_contents("albaran.txt", json_encode($_POST, JSON_PRETTY_PRINT));
        return [];
    },
];

function validar_credenciales()
{
    $api = $_SERVER['HTTP_X_ESTRATOS_API_KEY'] ?? "";
    $code = $_SERVER['HTTP_X_ESTRATOS_API_INSTANCE'] ?? "";

    if($api !== '1234'){
        throw new LogicException("API KEY no válida");
    }
    if($code !== 'prueba'){
        throw new LogicException("INSTNACE CODE no válido");
    }
}

function respond($content)
{
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: *");
    header('content-type: application/json; charset=utf8');
    echo json_encode($content, JSON_PRETTY_PRINT);
}

try {
    if(isset($actions[$action])){
        validar_credenciales();
        respond($actions[$action]());
    }else{
        throw new LogicException("Accion incorrecta");
    }
}catch(LogicException $ex){
    http_response_code(500);
    respond([
        'error' => $ex->getMessage(),
        'code' => $ex->getCode()
    ]);
}
