%{
const Tipo                      = require('./simbolo/Tipo')
const Nativo                    = require('./expresiones/Nativo')
const Aritmeticas               = require('./expresiones/Aritmetica')
const AccesoVar                 = require('./expresiones/AccesoVar')
const Declaracion               = require('./instrucciones/Declaracion')
const Print                     = require('./instrucciones/Print')
const Printl                    = require('./instrucciones/Printl')
const OperadoresRelacionales    =require('./expresiones/OperadoresRelacionales')
%}


%lex
%options case-insensitive

%%
\s+                                 {}
"//".*                              {}
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] {}

//---------
"int"                       return 'INT'
"double"                    return 'DOUBLE'
"char"                      return 'CHAR'
"bool"                      return 'BOOL'
"true"                      return 'TRUE'
"false"                     return 'FALSE'
"std::string"               return 'STRING'
"cout"                      return 'COUT'
"endl"                      return 'ENDL'

"["                         return 'CORCHETEIZQ'
"]"                         return 'CORCHETEDER'
"("                         return 'PARENTESISIZQ'
")"                         return 'PARENTESISDER'
"{"                         return 'LLAVEDER'
"}"                         return 'LLAVEIZQ'
";"                         return 'PYC'
"?"                         return 'INTERRO'
":"                         return 'DPUNTOS'
","                         return 'COMA'

"+"                         return 'MAS'
"-"                         return 'MENOS'
"*"                         return 'MULTICACION'
"/"                         return 'DIV'
"pow"                       return 'POW'
"%"                         return 'MODULO'

"=="                        return 'IGUALIGUAL'
"="                         return 'IGUAL'
"!="                        return 'DISTINTO'
"!"                         return 'EXCLAMA'
"<="                        return 'MENORIGUAL'
">="                        return 'MAYORIGUAL'
"<"                         return 'MENORQUE'
">"                         return 'MAYORQUE'


"||"                        return 'OR'
"&&"                        return 'AND'


[0-9]+"."[0-9]+                                                                 return 'DECIMAL'
[0-9]+                                                                          return 'ENTERO'
(\"(\\.|[^\\"])*\")                                                             { yytext=yytext.substr(1, yyleng-2);  return 'CADENA'; }
[']\\\\[']|[']\\\"[']|[']\\\'[']|[']\\n[']|[']\\t[']|[']\\r[']|['].?[']	        { yytext=yytext.substr(1, yyleng-2); return 'CARACTER' }
[a-z][a-z0-9_]*                                                                 return 'ID'

[\ \r\t\f\t]+               {}
[\ \n]                      {}

<<EOF>>                     return 'EOF'


%{

%}

/lex

// precedencias
%left 'OR'
%left 'AND'
%right 'EXCLAMA'
%left 'IGUALIGUAL' 'DISTINTO' 'MENORQUE' 'MENORIGUAL' 'MAYORQUE' 'MAYORIGUAL'
%left 'MAS' 'MENOS'
%left 'DIV' 'MULTICACION' 'MODULO'
%right 'pow'
%right 'UMENOS'
%start inicio
%%
inicio : instrucciones EOF                  { return $1; };

instrucciones : instrucciones instruccion   { $1.push($2); $$=$1; }
                | instruccion               { $$=[$1]; }
;

instruccion : declaracion_vars   { $$=$1; }
                | print        { $$=$1; }
;

declaracion_vars : tipoDato nombre_var IGUAL expresion PYC { $$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $4); } 
                | tipoDato nombre_var PYC                 { $$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, null); }
;

nombre_var : nombre_var COMA ID { $$=$1.push($3); $$=$1; }
                | ID { $$=[$1]; }
;

print :   COUT MENORQUE MENORQUE expresion PYC { $$= new Print.default($4, @1.first_line, @1.first_column); }
        | COUT MENORQUE MENORQUE expresion MENORQUE MENORQUE ENDL PYC { $$= new Printl.default($4, @1.first_line, @1.first_column); }
;

expresion : ENTERO     { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.ENTERO), $1, @1.first_line, @1.first_column); }
                | DECIMAL  { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.DECIMAL), $1, @1.first_line, @1.first_column); }
                | CARACTER { var text = $1.substr(0,$1.length); text = text.replace(/\\n/g, "\n"); text = text.replace(/\\\\/g, "\\"); text = text.replace(/\\\"/g,"\""); text = text.replace(/\\r/g, "\r"); text = text.replace(/\\t/g, "\t"); text = text.replace(/\\\'/g, "'"); $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CARACTER), text, @1.first_line, @1.first_column); }
                | CADENA   { var text = $1.substr(0,$1.length); text = text.replace(/\\n/g, "\n"); text = text.replace(/\\\\/g, "\\"); text = text.replace(/\\\"/g,"\""); text = text.replace(/\\r/g, "\r"); text = text.replace(/\\t/g, "\t"); text = text.replace(/\\\'/g, "'"); $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CADENA), text, @1.first_line, @1.first_column); }
                | TRUE     { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), true, @1.first_line, @1.first_column);  }
                | FALSE    { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), false, @1.first_line, @1.first_column);  }
                | ID       { $$ = new AccesoVar.default($1, @1.first_line, @1.first_column); } 
                | MENOS expresion %prec UMENOS { $$ = new Aritmeticas.default(Aritmeticas.Operadores.NEGATIVO, @1.first_line, @1.first_column, $2, null); }
                | expresion MAS expresion  { $$ = new Aritmeticas.default(Aritmeticas.Operadores.SUMA, @1.first_line, @1.first_column, $1, $3); }
                | expresion DIV expresion  { $$ = new Aritmeticas.default(Aritmeticas.Operadores.DIVISION, @1.first_line, @1.first_column, $1, $3); }
                | expresion MENOS expresion  { $$ = new Aritmeticas.default(Aritmeticas.Operadores.RESTA, @1.first_line, @1.first_column, $1, $3); }
                | expresion MULTICACION expresion  { $$ = new Aritmeticas.default(Aritmeticas.Operadores.MULTIPLICACION, @1.first_line, @1.first_column, $1, $3); }
                | POW PARENTESISIZQ expresion COMA expresion PARENTESISDER { $$ = new Aritmeticas.default(Aritmeticas.Operadores.POTENCIA, @1.first_line, @1.first_column, $3, $5); }
                | expresion MODULO expresion  { $$ = new Aritmeticas.default(Aritmeticas.Operadores.MODULO, @1.first_line, @1.first_column, $1, $3); } 
                | expresion MENORQUE expresion { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.MENORQUE, @1.first_line, @1.first_column, $1, $3); }
                | expresion MAYORQUE expresion { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.MAYORQUE, @1.first_line, @1.first_column, $1, $3); }
                | expresion MENORIGUAL expresion { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.MENORIGUAL, @1.first_line, @1.first_column, $1, $3); }
                | expresion IGUALIGUAL expresion { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.IGUALIGUAL, @1.first_line, @1.first_column, $1, $3); }
                | expresion DISTINTO expresion { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.DISTINTO, @1.first_line, @1.first_column, $1, $3); }
                | expresion MAYORIGUAL expresion { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.MAYORIGUAL, @1.first_line, @1.first_column, $1, $3); }
                | PARENTESISIZQ expresion PARENTESISDER {$$ = $2;}
;


tipoDato : INT   { $$ = new Tipo.default(Tipo.tipoDato.ENTERO); }
        | DOUBLE { $$ = new Tipo.default(Tipo.tipoDato.DECIMAL); }
        | CHAR   { $$ = new Tipo.default(Tipo.tipoDato.CARACTER); }
        | BOOL   { $$ = new Tipo.default(Tipo.tipoDato.BOOL); }
        | STRING { $$ = new Tipo.default(Tipo.tipoDato.CADENA); }
;