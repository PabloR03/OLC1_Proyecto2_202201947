%{
const Tipo                      = require('./simbolo/Tipo')
const Nativo                    = require('./expresiones/Nativo')
const Aritmeticas               = require('./expresiones/Aritmetica')
const AccesoVar                 = require('./expresiones/AccesoVar')
const Declaracion               = require('./instrucciones/Declaracion')
const Print                     = require('./instrucciones/Print')
const Printl                    = require('./instrucciones/Printl')
const OperadoresRelacionales    = require('./expresiones/OperadoresRelacionales')
const OperadoresLogicos         = require('./expresiones/OperadoresLogicos')
const FuncionesTexto            = require('./expresiones/FuncionTexto')
const AsignacionVar             = require('./instrucciones/AsignacionVar')
const Casteo                    = require('./expresiones/Casteos')
const IncrementoDecremento      = require('./instrucciones/IncrementoDecremento')
const Break                     = require('./Transferencia.ts/Break')
const If                        = require('./control/If')
const DoWhile                   = require('./Ciclos/DoWhile')
const For                       = require('./Ciclos/For')
const While                     = require('./Ciclos/While')
const Continue                  = require('./Transferencia.ts/Continue')
const Return                    = require('./Transferencia.ts/Return')
const Switch                    = require('./control/Switch')
const Case                      = require('./control/Case')
const Default                   = require('./control/Default')
const Ternario                  = require('./expresiones/Ternario')
const Metodo                    = require('./instrucciones/Metodo')
const Execute                   = require('./instrucciones/Run')
const Llamada                   = require('./instrucciones/Llamada')
const length                    = require('./expresiones/Length')
const C_STR                     = require('./expresiones/c_str')
const DeclaracionM              = require('./dimenciones/DeclaracionM')
const AsignacionM               = require('./dimenciones/AsignacionM')
const AccesoM                   = require('./dimenciones/AccesoM')
const DeclaracionA              = require('./dimenciones/DeclaracionA')
const AccesoA                   = require('./dimenciones/AccesoA')
const AsignacionA               = require('./dimenciones/AsignacionArreglo')
const DeclaracionACSTR          = require('./dimenciones/DeclaracionACSTR')

const Metodoso                  = require('./instrucciones/Metodoso')
const Llamadoso                 = require('./instrucciones/Llamadoso')
const Returnoso                 = require('./Transferencia.ts/retunrturn')
const Executoso                 = require('./instrucciones/Execute')



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
"tolower"                   return 'TOLOWER'
"toupper"                   return 'TOUPPER'
"round"                     return 'TOROUND'
"std::toString"             return 'TOSTRING'
"if"                        return 'IF'
"else"                      return 'ELSE'
"while"                     return 'WHILE'
"do"                        return 'DO'
"break"                     return 'BREAK'
"for"                       return 'FOR'
"continue"                  return 'CONTINUE'
"return"                    return 'RETURN'
"switch"                    return 'SWITCH'
"case"                      return 'CASE'
"default"                   return 'DEFAULT'
"typeof"                    return 'TYPEOF'
"void"                      return 'VOID'
"execute"                   return 'EXECUTE'
"return"                    return 'RETURN'
"new"                       return 'NEW'
"length"                    return 'LENGTH'
"c_str"                     return 'C_STR'

"if"                        return 'IF'
"else"                      return 'ELSE'
"while"                     return 'WHILE'
"do"                        return 'DO'

"["                         return 'CORCHETEIZQ'
"]"                         return 'CORCHETEDER'
"("                         return 'PARENTESISIZQ'
")"                         return 'PARENTESISDER'
"{"                         return 'LLAVEIZQ'
"}"                         return 'LLAVEDER'
";"                         return 'PYC'
"?"                         return 'INTERRO'
":"                         return 'DPUNTOS'
","                         return 'COMA'
"."                         return 'PUNTO'

"++"                        return 'INCREMENTO'
"--"                        return 'DECREMENTO' 
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
%left 'INTERRO'
%left 'OR'
%left 'AND'
%right 'EXCLAMA'
%left 'IGUALIGUAL' 'DISTINTO' 'MENORQUE' 'MENORIGUAL' 'MAYORQUE' 'MAYORIGUAL'
%left 'MAS' 'MENOS'
%left 'DIV' 'MULTICACION' 'MODULO'
%right 'pow'
%right 'UMENOS'
%left 'PUNTO'
%left 'PARENTESISIZQ'

%start inicio
%%
inicio : instrucciones EOF                  { return $1; };

instrucciones : instrucciones instruccion   { $1.push($2); $$=$1; }
                | instruccion               { $$=[$1]; }
;

instruccion : declaracion_vars  PYC   { $$=$1; }
                | asignacion_vars PYC { $$=$1; }
                | print      PYC      { $$=$1; }
                | ifs                 { $$=$1; }
                | fors                { $$=$1; }
                | whiles              { $$=$1; }
                | do_whiles           { $$=$1; }
                | breaks PYC          { $$=$1; }
                | continues PYC       { $$=$1; }
                | return PYC          { $$=$1; }
                | switchs             { $$=$1; }
                | metodos             { $$=$1; }
                | execute   PYC       { $$=$1; }
                | llamada PYC         { $$=$1; }
                | retunrs PYC         { $$=$1; }
                // | expresion PYC       { $$=$1; }
;

asignacion_vars : ID IGUAL expresion    { $$ = new AsignacionVar.default($1, $3, @1.first_line, @1.first_column); }
                | incrementos              { $$ = $1; }
                | ID CORCHETEIZQ expresion CORCHETEDER IGUAL expresion { $$ = new AsignacionA.default($1, $3, $6, @1.first_line, @1.first_column); }
                | ID CORCHETEIZQ expresion CORCHETEDER CORCHETEIZQ expresion CORCHETEDER IGUAL expresion { $$ = new AsignacionM.default($1, $3, $6, $9, @1.first_line, @1.first_column); }
;

res_booleanas : TRUE       { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), true, @1.first_line, @1.first_column);  }
                | FALSE    { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), false, @1.first_line, @1.first_column);  }
;

incrementos : ID INCREMENTO { $$ = new IncrementoDecremento.default("INCREMENTO", @1.first_line, @1.first_column, $1); }
        | ID DECREMENTO { $$ = new IncrementoDecremento.default("DECREMENTO", @1.first_line, @1.first_column, $1); }
;

declaracion_vars : tipoDato lista_nombre_var IGUAL expresion  { $$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, $4); } 
                | tipoDato lista_nombre_var                   { $$ = new Declaracion.default($1, @1.first_line, @1.first_column, $2, null); }
                | arreglos                                    { $$ = $1; }
                | matrices                                    { $$ = $1; }
;

lista_nombre_var : lista_nombre_var COMA ID { $$=$1.push($3); $$=$1; }
                | ID            { $$=[$1]; }
;

print :   COUT MENORQUE MENORQUE expresion                           { $$= new Print.default($4, @1.first_line, @1.first_column); }
        | COUT MENORQUE MENORQUE expresion MENORQUE MENORQUE ENDL    { $$= new Printl.default($4, @1.first_line, @1.first_column); }
;

expresion : ENTERO         { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.ENTERO), $1, @1.first_line, @1.first_column); }
                | DECIMAL  { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.DECIMAL), $1, @1.first_line, @1.first_column); }
                | CARACTER { var text = $1.substr(0,$1.length); text = text.replace(/\\n/g, "\n"); text = text.replace(/\\\\/g, "\\"); text = text.replace(/\\\"/g,"\""); text = text.replace(/\\r/g, "\r"); text = text.replace(/\\t/g, "\t"); text = text.replace(/\\\'/g, "'"); $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CARACTER), text, @1.first_line, @1.first_column); }
                | CADENA   { var text = $1.substr(0,$1.length); text = text.replace(/\\n/g, "\n"); text = text.replace(/\\\\/g, "\\"); text = text.replace(/\\\"/g,"\""); text = text.replace(/\\r/g, "\r"); text = text.replace(/\\t/g, "\t"); text = text.replace(/\\\'/g, "'"); $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.CADENA), text, @1.first_line, @1.first_column); }
                | TRUE     { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), true, @1.first_line, @1.first_column);  }
                | FALSE    { $$ = new Nativo.default(new Tipo.default(Tipo.tipoDato.BOOL), false, @1.first_line, @1.first_column);  }
                | ID       { $$ = new AccesoVar.default($1, @1.first_line, @1.first_column); }
                | MENOS expresion %prec UMENOS          { $$ = new Aritmeticas.default(Aritmeticas.Operadores.NEGATIVO, @1.first_line, @1.first_column, $2, null); }
                | expresion MAS expresion               { $$ = new Aritmeticas.default(Aritmeticas.Operadores.SUMA, @1.first_line, @1.first_column, $1, $3); }
                | expresion DIV expresion               { $$ = new Aritmeticas.default(Aritmeticas.Operadores.DIVISION, @1.first_line, @1.first_column, $1, $3); }
                | expresion MENOS expresion             { $$ = new Aritmeticas.default(Aritmeticas.Operadores.RESTA, @1.first_line, @1.first_column, $1, $3); }
                | expresion MULTICACION expresion       { $$ = new Aritmeticas.default(Aritmeticas.Operadores.MULTIPLICACION, @1.first_line, @1.first_column, $1, $3); }
                | POW PARENTESISIZQ expresion COMA expresion PARENTESISDER      { $$ = new Aritmeticas.default(Aritmeticas.Operadores.POTENCIA, @1.first_line, @1.first_column, $3, $5); }
                | expresion MODULO expresion                                    { $$ = new Aritmeticas.default(Aritmeticas.Operadores.MODULO, @1.first_line, @1.first_column, $1, $3); } 
                | expresion MENORQUE expresion                                  { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.MENORQUE, @1.first_line, @1.first_column, $1, $3); }
                | expresion MAYORQUE expresion                                  { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.MAYORQUE, @1.first_line, @1.first_column, $1, $3); }
                | expresion MENORIGUAL expresion                                { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.MENORIGUAL, @1.first_line, @1.first_column, $1, $3); }
                | expresion IGUALIGUAL expresion                                { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.IGUALIGUAL, @1.first_line, @1.first_column, $1, $3); }
                | expresion DISTINTO expresion                                  { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.DISTINTO, @1.first_line, @1.first_column, $1, $3); }
                | expresion MAYORIGUAL expresion                                { $$ = new OperadoresRelacionales.default(OperadoresRelacionales.OperadoresRelacionales.MAYORIGUAL, @1.first_line, @1.first_column, $1, $3); }
                | PARENTESISIZQ expresion PARENTESISDER {$$ = $2;}
                | expresion OR expresion        { $$ = new OperadoresLogicos.default(OperadoresLogicos.OperadorLogico.O_OR, @1.first_line, @1.first_column, $1, $3);} 
                | expresion AND expresion       { $$ = new OperadoresLogicos.default(OperadoresLogicos.OperadorLogico.O_AND, @1.first_line, @1.first_column, $1, $3);} 
                | EXCLAMA expresion             { $$ = new OperadoresLogicos.default(OperadoresLogicos.OperadorLogico.O_NOT, @1.first_line, @1.first_column, $2);}
                | TOLOWER PARENTESISIZQ expresion PARENTESISDER         { $$ = new FuncionesTexto.default(FuncionesTexto.Funcion.TOLOWER, @1.first_line, @1.first_column, $3); }
                | TYPEOF PARENTESISIZQ expresion PARENTESISDER          { $$ = new FuncionesTexto.default(FuncionesTexto.Funcion.TYPEOF, @1.first_line, @1.first_column, $3); }
                | TOUPPER PARENTESISIZQ expresion PARENTESISDER         { $$ = new FuncionesTexto.default(FuncionesTexto.Funcion.TOUPPER, @1.first_line, @1.first_column, $3); }
                | TOROUND PARENTESISIZQ expresion PARENTESISDER         { $$ = new FuncionesTexto.default(FuncionesTexto.Funcion.TOROUND, @1.first_line, @1.first_column, $3); }
                | TOSTRING PARENTESISIZQ expresion PARENTESISDER        { $$ = new FuncionesTexto.default(FuncionesTexto.Funcion.TOSTRING, @1.first_line, @1.first_column, $3); }
                | PARENTESISIZQ tipoDato PARENTESISDER expresion        { $$ = new Casteo.default($2, @1.first_line, @1.first_column, $4); } 
                | expresion INTERRO expresion DPUNTOS expresion         { $$ = new Ternario.default($1, $3, $5, @1.first_line, @1.first_column); }
                | expresion PUNTO LENGTH PARENTESISIZQ PARENTESISDER    { $$ = new length.default(length.Funcion.LENGTH,@1.first_line, @1.first_column, $1); }
                | expresion PUNTO C_STR PARENTESISIZQ PARENTESISDER     { $$ = new C_STR.default(C_STR.Funcion.C_STR,@1.first_line, @1.first_column, $1); }
                | ID CORCHETEIZQ expresion CORCHETEDER CORCHETEIZQ expresion CORCHETEDER { $$ = new AccesoM.default($1, @1.first_line, @1.first_column, $3, $6); }
                | ID CORCHETEIZQ expresion CORCHETEDER                                   { $$ = new AccesoA.default($1, @1.first_line, @1.first_column, $3); }
                | llamada                                        { $$=$1; }

;


tipoDato : INT   { $$ = new Tipo.default(Tipo.tipoDato.ENTERO); }
        | DOUBLE { $$ = new Tipo.default(Tipo.tipoDato.DECIMAL); }
        | CHAR   { $$ = new Tipo.default(Tipo.tipoDato.CARACTER); }
        | BOOL   { $$ = new Tipo.default(Tipo.tipoDato.BOOL); }
        | STRING { $$ = new Tipo.default(Tipo.tipoDato.CADENA); }
        | VOID   { $$ = new Tipo.default(Tipo.tipoDato.VOID); }
;


ifs : IF PARENTESISIZQ expresion PARENTESISDER LLAVEIZQ instrucciones LLAVEDER                    { $$ = new If.default($3,$6,null,@1.first_line, @1.first_column); }
        | IF PARENTESISIZQ expresion PARENTESISDER LLAVEIZQ instrucciones LLAVEDER elses { $$ = new If.default($3,$6,$8,@1.first_line, @1.first_column); }     
;

elses : ELSE ifs                       {  let instrucciones = []; instrucciones.push($2); $$ = instrucciones; }
        | ELSE LLAVEIZQ instrucciones LLAVEDER  { $$ = $3; }
;

whiles : WHILE PARENTESISIZQ expresion PARENTESISDER LLAVEIZQ instrucciones LLAVEDER { $$ = new While.default($3,$6,@1.first_line, @1.first_column); }
;

do_whiles : DO LLAVEIZQ instrucciones LLAVEDER WHILE PARENTESISIZQ expresion PARENTESISDER PYC { $$ = new DoWhile.default($7,$3,@1.first_line, @1.first_column); }
;

forfuncional : declaracion_vars  { $$=$1; }
        | asignacion_vars        { $$=$1; }
;

fors : FOR PARENTESISIZQ forfuncional PYC expresion PYC asignacion_vars PARENTESISDER LLAVEIZQ instrucciones LLAVEDER { $$ = new For.default($3,$5,$7,$10,@1.first_line, @1.first_column); }
;


breaks: BREAK  { $$ = new Break.default(@1.first_line, @1.first_column); }
;


continues: CONTINUE  { $$ = new Continue.default(@1.first_line, @1.first_column); }
;

retunrs : RETURN { $$ = new Break.default(@1.first_line, @1.first_column); }
                | RETURN expresion { $$ = new Returnoso.default(@1.first_line, @1.first_column, $2); }
;


switchs: SWITCH PARENTESISIZQ expresion PARENTESISDER LLAVEIZQ cases defaults LLAVEDER { $$ = new Switch.default($3, @1.first_line, @1.first_column, $6, $7) }
        | SWITCH PARENTESISIZQ expresion PARENTESISDER LLAVEIZQ cases LLAVEDER { $$ = new Switch.default($3, @1.first_line, @1.first_column, $6, undefined) }
        | SWITCH PARENTESISIZQ expresion PARENTESISDER LLAVEIZQ defaults LLAVEDER { $$ = new Switch.default($3, @1.first_line, @1.first_column, undefined, $6) }
;

cases : cases caso { if($2 != false) $1.push($2); $$ = $1 }
                | caso { $$ = ($1 != false) ? [$1] : [] }
;

caso : CASE expresion DPUNTOS instrucciones { $$ = new Case.default($2, $4, @1.first_line, @1.first_column) }
;

defaults : DEFAULT DPUNTOS instrucciones { $$ = new Default.default($3, @1.first_line, @1.first_column) }
;


metodos : tipoDato ID PARENTESISIZQ parametross PARENTESISDER LLAVEIZQ instrucciones LLAVEDER { $$ = new Metodo.default($2, $1, $7, @1.first_line, @1.first_column, $4); }
        | tipoDato ID PARENTESISIZQ PARENTESISDER LLAVEIZQ instrucciones LLAVEDER { $$ = new Metodo.default($2, $1, $6, @1.first_line, @1.first_column); }
;
parametross : parametross COMA tipoDato ID {$1.push({tipo:$3, id:[$4]}); $$ = [$1]; }
        | tipoDato ID { $$ = [{tipo:$1, id:[$2]}] }
;
execute : EXECUTE ID PARENTESISIZQ paramscall PARENTESISDER     { $$ = new Execute.default($2, @1.first_line, @1.first_column, $4); }
        | EXECUTE ID PARENTESISIZQ PARENTESISDER                { $$ = new Execute.default($2, @1.first_line, @1.first_column, []); }
; 

llamada : ID PARENTESISIZQ paramscall PARENTESISDER { $$ = new Llamada.default($1, @1.first_line, @1.first_column, $3); }
        | ID PARENTESISIZQ PARENTESISDER { $$ = new Llamada.default($1, @1.first_line, @1.first_column, []); }
;

paramscall: paramscall COMA expresion { $1.push($3); $$ = $1; }
        | expresion { $$ = [$1]; }
;

/*
metodos : tipoDato ID PARENTESISIZQ parametross PARENTESISDER LLAVEIZQ instrucciones LLAVEDER { $$ = new Metodoso.default($1, $2, $4, $7, @1.first_line, @1.first_column); }
        | tipoDato ID PARENTESISIZQ PARENTESISDER LLAVEIZQ instrucciones LLAVEDER { $$ = new Metodoso.default($1, $2, [], $6, @1.first_line, @1.first_column); }
;
parametross : parametross COMA tipoDato ID {$1.push({tipo:$3, id:[$4]}); $$ = $1; }
        | tipoDato ID { $$ = [{tipo:$1, id:[$2]}] }
;
execute : EXECUTE ID PARENTESISIZQ paramscall PARENTESISDER     { $$ = new Executoso.default($2,$4, @1.first_line, @1.first_column); }
        | EXECUTE ID PARENTESISIZQ PARENTESISDER                { $$ = new Executoso.default($2,[], @1.first_line, @1.first_column); }
; 

llamada : ID PARENTESISIZQ paramscall PARENTESISDER { $$ = new Llamadoso.default($1, $3, @1.first_line, @1.first_column); }
        | ID PARENTESISIZQ PARENTESISDER { $$ = new Llamadoso.default($1, [], @1.first_line, @1.first_column); }
;

paramscall: paramscall COMA expresion { $1.push($3); $$ = $1; }
        | expresion { $$ = [$1]; }
;
*/

matrices : tipoDato ID CORCHETEIZQ CORCHETEDER CORCHETEIZQ CORCHETEDER IGUAL CORCHETEIZQ contenidomatrix CORCHETEDER { $$ = new DeclaracionM.default($1,@1.first_line, @1.first_column, $2, $9); }
                | tipoDato ID CORCHETEIZQ CORCHETEDER CORCHETEIZQ CORCHETEDER IGUAL NEW tipoDato CORCHETEIZQ expresion CORCHETEDER CORCHETEIZQ expresion CORCHETEDER { $$ = new DeclaracionM.default($1,@1.first_line, @1.first_column, $2, null, $11, $14); }
;

arreglos : tipoDato ID CORCHETEIZQ CORCHETEDER IGUAL CORCHETEIZQ contenidoarreglo CORCHETEDER { $$ = new DeclaracionA.default($1,@1.first_line, @1.first_column, $2, $7); }
                | tipoDato ID CORCHETEIZQ CORCHETEDER IGUAL NEW tipoDato CORCHETEIZQ expresion CORCHETEDER { $$ = new DeclaracionA.default($1,@1.first_line, @1.first_column, $2, null, $9); }
                | tipoDato ID CORCHETEIZQ CORCHETEDER IGUAL expresion { $$ = new DeclaracionACSTR.default($1,@1.first_line, @1.first_column, $2, $6); }
;

contenidoarreglo : contenidoarreglo COMA expresion { $1.push($3); $$ = $1; }
                | expresion { $$ = [$1]; }
;

contenidomatrix : contenidomatrix COMA CORCHETEIZQ contenidoarreglo CORCHETEDER { $1.push($4); $$ = $1; }
                | CORCHETEIZQ contenidoarreglo CORCHETEDER { $$ = [$2]; }
;
