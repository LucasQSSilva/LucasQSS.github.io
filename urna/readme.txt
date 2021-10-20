A aplicação possui a seguinte divisão:

1) Arquivos do front:
  - pasta css, que contem os arquivos css
  - pasta img, que contem as imagens carregadas na tela
  - pasta audio, que contem os sons reproduzidos
  - pasta js, com os arquivos em javascript
  - etapas.json, com os dados dos candidatos
  - index.html , pagina da web
  
2) Arquivos do back:
  - pasta Scripts, que contem o script de inicialização do banco
  - conexao.php , que conecta ao banco criado na pasta scripts e atualiza a contagem de votos (usa o root default do phpmyadmin)
  - consultaBanco.php, que busca os valores correntes do banco ao carregar a página e os exibe na tela
  
3) Documentação:
  - pasta Doxygen_Docs, com a documentação gerada pelo doxygen para o conexao.php
  - pasta JSDoc_Docs, com a documentação gerada pelo JSDoc para o script.js
  
  
