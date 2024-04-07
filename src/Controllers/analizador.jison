%{
    // codigo de JS si fuese necesario
%}

// analizador lexico

// directiva lex para realizar el analisis lexico
%lex

// hacemos que nuestro lenguaje sea case insensitive
%options case-insensitive

%%
// palabras reservadas
"evaluar"               return 'TKEVALUAR';
"imprimir"              return 'TKIMPRIMIR';
"redondear"             return 'TKREDONDEAR';
"longitud"              return 'TKLONGITUD';      

// simbolos del lenguaje

"{"                         return 'LLAVE1';
"}"                         return 'LLAVE2';
";"                         return 'FINCADENA';
"+"                         return 'MAS';
"-"                         return 'MENOS';
"*"                         return 'MULT';
"/"                         return 'DIV';
"("                         return 'PAR1';
")"                         return 'PAR2';
[0-9]+"."[0-9]+             return 'DECIMAL';
[0-9]+                      return 'ENTERO';
[\"]((\\\")|[^\"\n])*[\"]   {yytext=yytext.substring(1,yyleng-1); return 'CADENA';}

[\ \f\t\n\r]+                  {};
[\n\ ]                         {};

// fin de cadena
<<EOF>>                     return 'EOF';

%{
    // codigo de JS si fuese necesario
%}

// directiva para usar los tokens reconocidos arriba
/lex

// precedencias
%left 'MAS' 'MENOS'
%left 'MULT' 'DIV'
%left 'UMENOS'

// simbolo inicial
%start INICIO
%%


// reglas de produccion

INICIO : INSTRUCCIONES EOF                      {   console.log($1);    }    // imprime el resultado de las instrucciones
;

INSTRUCCIONES : INSTRUCCIONES INSTRUCCION       { $1.push($2); $$ = $1;}
              | INSTRUCCION                     { $$ = [$1]; }
;


INSTRUCCION : EVALUAR   {   $$ = $1;  }
           | IMPRIMIR   {   $$ = $1;  }
;

EVALUAR : TKEVALUAR LLAVE1 EXPRESION LLAVE2 FINCADENA       {   $$ = $3; /*console.log($3);*/    }
;

IMPRIMIR : TKIMPRIMIR LLAVE1 CADENA LLAVE2 FINCADENA        {   $$ = $3; /*console.log($3);*/    }
;

EXPRESION : EXPRESION MAS EXPRESION             {   $$ = $1 + $3;      }
          | EXPRESION MENOS EXPRESION           {   $$ = $1 - $3;      }
          | EXPRESION MULT EXPRESION            {   $$ = $1 * $3;      }
          | EXPRESION DIV EXPRESION             {   $$ = $1 / $3;      }
          | PAR1 EXPRESION PAR2                 {   $$ = $2;           }
          | MENOS EXPRESION %prec UMENOS        {   $$ = $2 * -1;      }
          | ENTERO                              {   $$ = Number($1);   }
          | DECIMAL                             {   $$ = Number($1);   }
          | ROUND      {   $$ = $1;  }
          | LENGHT     {   $$ = $1;  }
;

ROUND : TKREDONDEAR PAR1 EXPRESION PAR2   {   $$ = Math.round($3);   }
;

LENGHT : TKLONGITUD PAR1 CADENA PAR2        {   $$ = $3.length; }
;