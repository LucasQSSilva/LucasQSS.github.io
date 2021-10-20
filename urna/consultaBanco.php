<?php
    /**
     * Criamos nossa conexão dado um usuário (nesse caso o root)
     */
    // User e senha default do phpmyadmin
    $servidor = "localhost";
    $usuario = "root";
    $senha = "";
    $nome_banco = "urna";

    // Criando a conexao
    $mysqli = new mysqli($servidor, $usuario, $senha, $nome_banco);

    // Checando a conexao
    if ($mysqli -> connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
        exit();
    }
    //echo "Connected successfully";

    // Busca na tabela 'vereador' os números de cada candidato, seus nomes e os votos acumulados
    $sql = "SELECT NUMERO_URNA, NOME, VOTOS_ACUMULADOS FROM `vereador`";
    $result = mysqli_query($mysqli, $sql); 

    // Exibe os resultados com uma tabela de tamanho fixo do tamanho do div
    echo "<table border='2' width=100%>";
    echo "<th scope = col>Número Candidato Vereador</th>
        <th scope = col>Nome Candidato</th>
        <th scope = col>Votos Acumulados</th>";

    while ($row = mysqli_fetch_assoc($result)) {
        echo "<tr>";
        foreach ($row as $field => $value) {
            echo "<td>" . $value . "</td>"; 
        }
        echo "</tr>";
    }
    echo "</table>";

    // Busca na tabela 'prefeito' os números de cada candidato, seus nomes e os votos acumulados
    $sql = "SELECT NUMERO_URNA, NOME, VOTOS_ACUMULADOS FROM `prefeito`";
    $result = mysqli_query($mysqli, $sql);

    // Cria a tabela de prefeito com o mesmo tamanho da tabela vereador
    echo "<br><table border='2' width=100%>";
    echo "<th scope = col>Número Candidato Prefeito</th>
        <th scope = col>Nome Candidato</th>
        <th scope = col>Votos Acumulados</th>";
    while ($row = mysqli_fetch_assoc($result)) { 
        echo "<tr>";
        foreach ($row as $field => $value) { 
            echo "<td>" . $value . "</td>"; 
        }
        echo "</tr>";
    }
    echo "</table>";

  ?>