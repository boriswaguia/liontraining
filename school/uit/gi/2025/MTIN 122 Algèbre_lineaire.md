# MTIN 122 Algèbre_lineaire


---

## Page 1

UNIVERSITE DE DOUALA
IUT DE DOUALA
UE IUT MTIN 12 : MATHEMATIQUES ET EPS
ALGEBRE ET GEOMETRIE
EC MTIN 122
 NIVEAU 1
SEMESTRE 1
2020/2021
VOLUME HORAIRE    45H
ENSEIGNANTS
Pr BOWONG  CM 24H    TD  0H     TPE  6H
M. NGWA       CM  0H     TD  12H   TPE  3H 


---

## Page 3

Cours d’Alg`ebre Lin´eaire
par
Samuel BOWONG
Universit´e de Douala
Ann´ee Acad´emique 2020-2021
2


---

## Page 4

Table des mati`eres
1
Espaces vectoriels
3
1.1
D´eﬁnition et exemples
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
3
1.2
Sous-espaces vectoriels . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
5
1.3
Combinaisons lin´eaires . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
6
1.4
Familles g´en´eratrices . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
7
1.5
Familles libres . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
8
1.6
Bases d’un espace vectoriel
. . . . . . . . . . . . . . . . . . . . . . . . . . . . .
9
1.6.1
D´eﬁnition, exemples
. . . . . . . . . . . . . . . . . . . . . . . . . . . . .
9
1.6.2
Dimension d’un espace vectoriel . . . . . . . . . . . . . . . . . . . . . . .
10
1.7
Coordonn´ees d’un vecteur
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
11
1.8
Comment extraire une base d’une famille g´en´eratrice ? . . . . . . . . . . . . . . .
11
1.9
Comment trouver une base d’un espace vectoriel donn´e par un syst`eme d’´equations ? 12
1.10 Travaux dirig´es sur les Espaces vectoriels . . . . . . . . . . . . . . . . . . . . . .
13
2
Les matrices
15
2.1
L’espace vectoriel des matrices . . . . . . . . . . . . . . . . . . . . . . . . . . . .
15
2.1.1
Op´erations sur les matices . . . . . . . . . . . . . . . . . . . . . . . . . .
16
2.2
Matrices Carr´ees
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
19
2.2.1
Diagonale et Trace d’une matrice carr´ee
. . . . . . . . . . . . . . . . . .
19
2.2.2
Matrices carr´ees particuli`eres
. . . . . . . . . . . . . . . . . . . . . . . .
20
2.2.3
Matrices inversibles . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
21
2.3
Rang d’une matrice . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
22
2.4
Travaux dirig´es sur le calcul matriciel . . . . . . . . . . . . . . . . . . . . . . . .
23
3
Applications lin´eaires
25
3.1
D´eﬁnitions et Exemples . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
25
3.2
Noyau et Image d’une application lin´eaire
. . . . . . . . . . . . . . . . . . . . .
27
3.3
Application lin´eaire en dimension ﬁnie
. . . . . . . . . . . . . . . . . . . . . . .
30
3.4
Matrice d’une application lin´eaire . . . . . . . . . . . . . . . . . . . . . . . . . .
31
3.5
Fiche de TD sur les applications lin´eaires . . . . . . . . . . . . . . . . . . . . . .
35
4
Les D´eterminants des Matrices carr´ees
38
4.1
D´eﬁnition r´ecursive du d´eterminant . . . . . . . . . . . . . . . . . . . . . . . . .
38
4.2
Propri´et´es des d´eterminants . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
40
4.2.1
D´eterminant d’une famille de vecteurs
. . . . . . . . . . . . . . . . . . .
41
4.3
Sous matrices Mineurs et Mineurs principaux
. . . . . . . . . . . . . . . . . . .
41
4.4
Applications du calcul du d´eterminant
. . . . . . . . . . . . . . . . . . . . . . .
42
4.4.1
Inverse d’une Matrice . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
42
4.4.2
D´eterminant d’un syst`eme de n vecteurs en dimension n
. . . . . . . . .
43
1


---

## Page 5

4.5
TD sur le d´eterminant . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
44
5
Syst`emes Lin´eaires
46
5.1
Les diﬀ´erentes pr´esentations d’un syst`eme d’´equations lin´eaires . . . . . . . . . .
46
5.1.1
Pr´esentation classique
. . . . . . . . . . . . . . . . . . . . . . . . . . . .
46
5.1.2
Ecriture matricielle d’un syst`eme
. . . . . . . . . . . . . . . . . . . . . .
46
5.1.3
Avec une application lin´eaire . . . . . . . . . . . . . . . . . . . . . . . . .
47
5.2
Syst`emes de Cramer . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
47
5.3
R´esolution d’un syst`eme. Structure de l’ensemble des solutions . . . . . . . . . .
49
5.3.1
Structure de l’ensemble des solutions . . . . . . . . . . . . . . . . . . . .
49
5.4
M´ethodes de r´esolution d’un syst`eme lin´eaire : M´ethode du pivot de Gauss . . .
50
5.5
TD sur les syst`emes lin´eaires . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
52
2


---

## Page 6

Chapitre 1
Espaces vectoriels
1.1
D´eﬁnition et exemples
Soit E un ensemble. On suppose que l’on sait additionner les ´el´ements de E entre eux, et
qu’on obtient alors un ´el´ement de E. On note
a + b
la somme des ´el´ements a et b de E. On suppose aussi que l’on sait multiplier un ´el´ement de E
quelconque par un r´eel ou complexe, et que l’on obtient ainsi un ´el´ement de E. On note
λ · a
le produit du r´eel ou complexe λ et de a ∈E. Dans ces conditions, on dit que ”+” est une loi
de composition interne sur E, et que ”.” est une loi de composition externe sur K × E.
Exemple 1.1.1 Soit E = R. On sait ajouter deux ´el´ements de R, et multiplier un ´el´ement de
R par un ´el´ement de R.
Exemple 1.1.2 Soit E = Rn, c’est-`a-dire l’ensemble des n-uplets de la forme (x1; x2; . . . ; xn)
d’´el´ements de R. Les nombres r´eels x1, x2, ..., xn sont appel´es composantes du n-uplet (x1; x2; . . . ; xn).
On sait ajouter deux n-uplets, suivant la d´eﬁnition
(x1; x2; . . . ; xn) + (y1; y2; . . . ; yn) := (x1 + y1; x2 + y2; . . . ; xn + yn);
c’est-`a-dire composante par composante. On sait aussi multiplier un n-uplets par un r´eel :
λ · (x1; x2; . . . ; xn) := (λx1; λx2; . . . ; λxn)
Il s’agit l`a encore de multiplier chacune des composantes par λ
Exemple 1.1.3 Soit V l’ensemble des vecteurs du plan ou de l’espace. On se rappelle qu’un
vecteur non-nul est la donn´ee d’une direction, d’un sens et d’une longueur. Si −→v est le vecteur
nul, λ · −→v est le vecteur nul pour tout r´eel λ. Pour λ ∈R et −→v ∈V non-nul, le vecteur λ · −→v
est le vecteur nul si λ = 0, et pour λ ̸= 0,
— le vecteur de mˆeme direction que −→v ,
— de mˆeme sens que −→v si λ > 0 et de sens oppos´e si λ < 0
— de longueur |λ| fois la longueur de −→v .
On sait aussi ajouter deux vecteurs −→u et −→v de V : on trace un repr´esentant de −→v en partant
de l’extr´emit´e d’un repr´esentant de −→u .
3


---

## Page 7

Exemple 1.1.4 Soit X un ensemble quelconque, et F(X; R) l’ensemble des fonctions de X
dans R. La somme h = f + g de deux fonctions f et g est la fonction d´eﬁnie par
h : x 7−→f(x) + g(x).
Le produit k = λ · f de la fonction f par un r´eel λ est la fonction d´eﬁnie par `u
k : x 7−→λ.f(x).
Ces d´eﬁnitions sont les d´eﬁnitions usuelles dans le cas de X = R.
D´eﬁnition 1.1.1 Soit (E; +; ·) un triplet constitu´e d’un ensemble E, d’une loi de composition
interne ”+” sur E et d’une loi de composition externe ”.” sur E. On dit que (E; +; ·) est un
espace vectoriel sur K lorsque les lois ”+” et ”.” v´eriﬁent les huit propri´et´es suivantes :
1. Pour tous a, b de E,
a + b = b + a
2. Pour tous a, b et c de E,
a + (b + c) = (a + b) + c .
3. Il existe un ´el´ement e de E tel que pour tout a de E,
a + e = e + a = a .
4. Pour tout a de E, il existe un ´el´ement b de E tel que
a + b = b + a = e .
N. Pour tout a de E,
1 · a = a .
A. Pour tous r´eels λet µ, et tout a ∈E,
λ · (µ · a) = (λµ·)a .
D1. Pour tous r´eels λet µ, et tout a ∈E,
(λ + µ) · a = λ · a + µ · a .
D2. Pour tous a, b de E et tout r´eel λ,
λ · (a + b) = λ · a + λ · b .
Lorsque la propri´et´e (1) est v´eriﬁ´ee, on dit que la loi ”+” est commutative. Si la propri´et´e
(2) est v´eriﬁ´ee, on dit que la loi ”+” est associative. L’´el´ement e de la propri´et´e (3) est appel´e
´el´ement neutre pour la loi ”+”. On le note la plupart du temps 0E o`u mˆeme 0.
Remarque 1.1.1 Il ne peut y avoir qu’un seul ´el´ement neutre pour une loi interne : si e1 et
e2 sont ´el´ements neutres, on a
e1 = e1 + e2 = e2.
L’´el´ement b de la propri´et´e (4) s’il existe est lui aussi n´ecessairement unique :
b2 = b2 + e = b2 + (a + b1) = (b2 + a) + b1 = b1.
Le cas ´ech´eant, on l’appelle sym´etrique de a, et on le note b = −a
4


---

## Page 8

D´eﬁnition 1.1.2 Lorsque les propri´et´es (1) `a (4) sont v´eriﬁ´ees, on dit que (E; +) est un groupe
commutatif.
Lorsque la propri´et´e (N) est v´eriﬁ´ee, on dit que le r´eel 1 est l’´element neutre pour la loi
externe. On dit que la loi externe est associative lorsque (A) est vraie. Les deux derni`eres pro-
pri´et´es (D1) et (D2) sont des propri´et´es de distributivit´e. On reprend les exemples pr´ec´edents,
et on montre que l’on a bien aﬀaire `a des espaces vectoriels.
Exemple 1.1.5 Dans E = R, l’addition et la multiplication usuelles poss`edent bien les huit
propri´et´es de la d´eﬁnition : (R; +; ·) est un espace vectoriel.
Exemple 1.1.6 Dans E = Rn, les deux lois de compositions d´eﬁnies ci-dessus ont aussi les
huit propri´et´es de la d´eﬁnition. En eﬀet les op´erations sont d´eﬁnies composante par composante,
donc il suﬃt de v´eriﬁer leurs propri´et´es composante par composante, et l’on se retrouve alors
dans (R; +; ·) . On notera que l’´el´ement neutre pour l’addition dans Rn est
0Rn = (0; 0; . . . ; 0);
et le sym´etrique du n-uplet a = (x1; x2; . . . ; xn) et
b = −a = (−x1; −x2; . . . ; −xn) .
Exemple 1.1.7 L’ensemble F(X; R) muni des deux op´erations d´eﬁnies dans l’exemple 1.1.4
est un espace vectoriel. L`a encore on se ram`ene aux propri´et´es ´equivalentes dans (R; +; ·) qui
est cette fois l’espace d’arriv´ee des fonctions de F(X; R). L’´el´ement neutre pour l’addition dans
F(X; R) est la fonction nulle 0F(X;R) : x 7−→0.
1.2
Sous-espaces vectoriels
D´eﬁnition 1.2.1 Soit (E; +; ·) un espace vectoriel, et F une partie de E. On dit que F est un
sous-espace vectoriel de E lorsque les trois propri´et´es suivantes sont v´eriﬁ´ees :
(i) Le vecteur nul 0E de E appartient `a F .
(ii) Pour tout r´eel λ et tout ´el´ement v de F ,λ · v est aussi un ´el´ement de F .
(iii) Pour tous ´el´ements a et b de F , a + b est aussi un ´el´ement de F.
Exemple 1.2.1
Dans (R; +; ·), les seuls sous espaces vectoriels sont {0} et R lui-mˆeme.
Exemple 1.2.2 L’ensemble F = {(x; y) ∈R2; x + y = 0} est un sous-espace vectoriel de R2.
En eﬀet :
— (0; 0) ∈Fcar ............................................
— Si λ ∈R et (x; y) ∈F alors on a
λx + λy = λ · (x + y) = 0;
ce qui prouve que λ(x; y) = (λx + λy) ∈F.
— Si (x; y) et (x0; y0) appartiennent `a F alors
(x + x0) + (y + y0) = (x + y) + (x0 + y0) = 0 + 0 = 0,
ce qui prouve que (x; y) + (x0; y0) = (x + x0; y + y0) appartient `a F.
5


---

## Page 9

Attention, l’ensemble G = {(x; y) ∈R2; x + y = 1} n’est pas un sous-espace vectoriel de R2.
En fait cet ensemble ne v´eriﬁe aucune des propri´et´es de la d´eﬁnition pr´ec´edente.
Remarque 1.2.1 L’ensemble F = {0E} est un sous-espace vectoriel de n’importe quel espace
vectoriel E. En eﬀet 0E + 0E = 0E et λ · 0E = 0E pour tout λ ∈R. On parle du sous-espace
vectoriel nul.
Remarque 1.2.2 Pour montrer qu’un ensemble muni de deux lois est un espace vectoriel, on
a toujours int´erˆet `a d´emontrer que c’est un sous-espace vectoriel d’un espace vectoriel connu
qui le contient. Il n’y a alors que trois propri´et´es `a d´emontrer, au lieu des huit propri´et´es de la
d´eﬁnition.
1.3
Combinaisons lin´eaires
D´eﬁnition 1.3.1 Soit u1; u2; . . . ; un des vecteurs d’un espace vectoriel (E; +; ·). On dit que v ∈
E est une combinaison lin´eaire des vecteurs u1; u2; . . . ; un lorsqu’il existe des r´eels λ1; λ2; . . . ; λn
tels que
v = λ1 · u1 + λ2 · u2 + . . . + λn · un
Il est parfois commode d’utiliser une notation plus compacte pour ´ecrire les combinaisons
lin´eaires, ou de mani`ere plus g´en´erale, les sommes. Pour des vecteurs (ou des r´eels) u1, u2, . . . , un,
on ´ecrit
X =
n
X
j=1
uj = u1 + u2 + . . . + un
Avec cette notation la combinaison lin´eaire ci-dessus s’´ecrit
v =
n
X
j=1
λjuj .
Exemple 1.3.1 Dans R3, le vecteur u = (3; 3; 1) est-il combinaison lin´eaire de v1 = (1; 1; 0)
et v2 = (1; 1; 1) ?
Il s’agit de savoir s’il existe deux r´eels λ1 et λ2 tels que
λ1 · (1; 1; 0) + λ2 · (1; 1; 1) = (3; 3; 1) .
On est donc amen´e `a r´esoudre le syst`eme



λ1 + λ2
=
3
λ1 + λ2
=
3
λ2
=
1
Ce syst`eme a une (unique) solution (λ1; λ2) = (2; 1), donc u = 2v1 + v2 est bien combinaison
lin´eaire de v1 et v2.
Exemple 1.3.2 A quelle condition le vecteur w = (a; b; c) est-il une combinaison lin´eaire de
u = (1; 2; −1) et v = (6; 4; 2) ?
C’est le cas si et seulement si il existe deux r´eels λ1 et λ2 tels que
λ1 · (1; 2; −1) + λ1 · (6; 4; 2) = (a; b; c).
6


---

## Page 10

Il s’agit donc de savoir `a quelle condition sur a; b et c le syst`eme



λ1 + 6λ2
=
a
2λ1 + 4λ2
=
b
−λ1 + 2λ2
=
c
admet des solutions. On applique la m´ethode du pivot `a ce syst`eme et on obtient le syst`eme
´equivalent



λ1 + 6λ2
=
a
−8λ2
=
b −2a
0
=
c −a + b
Ce syst`eme a donc une solution si et seulement si le dernier second membre est nul, c’est-`a-dire
c −a + b = 0.
On vient de trouver une ´equation cart´esienne de l’ensemble des solutions du syst`eme.
1.4
Familles g´en´eratrices
Proposition 1.4.1 Soit u1; u2; . . . ; un des vecteurs d’un espace vectoriel (E; +; ·). L’ensemble
de toutes les combinaisons lin´eaires des vecteurs u1; u2; . . . ; un est un sous-espace vectoriel de
E. On le note
V ect{u1; u2; . . . ; un}
et on parle du sous-espace vectoriel engendr´e par la famille (u1; u2; . . . ; un).
Preuve:
— D’abord le vecteur nul de E peut s’´ecrire
0E = 0 · u1 + 0 · u2 + . . . + 0 · un;
donc appartient `a V ect{u1; u2; . . . ; un}.
— Soit ensuite v et w des vecteurs de V ect{u1; u2; . . . ; un}. On peut ´ecrire
v = a1 · u1 + a2 · u2 + . . . + an · un
et
w = b1 · u1 + b2 · u2 + . . . + bn · un;
donc
v + w = (a1 + b1) · u1 + (a2 + b2) · u2 + . . . + (an + bn) · un
ce qui prouve que v + w ∈V ect{u1; u2; . . . ; un}.
— Enﬁn pour λ ∈K, on a
λ · v = λ · (a1 · u1 + . . . + an · un) = (λa1) · u1 + . . . + (λan) · un;
donc λ · v appartient aussi `a V ect{u1; u2; . . . ; un}.
□
Remarque 1.4.1 Le sous-espace vectoriel V ect{u1; u2; . . . ; un} est le plus petit (pour l’inclu-
sion) des sous-espaces vectoriels de E qui contient u1; u2; . . . ; un. En eﬀet si F est un tel sous-
espace vectoriel de E, comme il est stable par combinaison lin´eaire, il contient toutes les com-
binaisons lin´eaires de u1; u2; . . . ; un, donc V ect{u1; u2; . . . ; un}.
7


---

## Page 11

D´eﬁnition 1.4.1 Soit (E; +; ·) un espace vectoriel et G un sous-espace vectoriel de E. On dit
que la famille de vecteurs (u1; u2; . . . ; un) engendre G, ou encore est une famille g´en´eratrice
de G, lorsque
G = V ect{u1; u2; . . . ; un}.
Exemple 1.4.1 Soit n ∈N. On note Kn[X] l’ensemble des polynˆomes `a coeﬃcients dans K
de degr´e inf´erieur ou ´egal `a n. C’est un sous-ensemble de F(K, K), et mˆeme un sous-espace
vectoriel pour l’addition des fonctions et la multiplication d’une fonction par un r´eel. En eﬀet
la fonction nulle est par convention un polynˆome de degr´e −1, donc (par abus de langage)
inf´erieur ou ´egal `a n, et une combinaison lin´eaire de polynˆomes de degr´e inf´erieur ou ´egal `a n
est bien un polynˆome de degr´e inf´erieur ou ´egal `a n. Mais au fait qu’est-ce qu’un polynˆome de
degr´e inf´erieur ou ´egal `a n ? C’est une combinaison lin´eaire des monˆomes
1;
X;
X2; . . . ; Xn.
Autrement dit Kn[X] est le sous-espace vectoriel de F(K, K) engendr´e par la famille (1; X; . . . ; Xn).
Kn[X] = V ect(1; X; . . . ; Xn) .
Dans R3, la famille ((1; 1; 2); (−1; 0; 1); (2; 1 = 3; −1)) est-elle g´en´eratrice ?
R´eponse : Pour le savoir, on se donne un vecteur quelconque (x; y; z) de R3, et on cherche `a
l’´ecrire comme combinaison lin´eaire des trois vecteurs de la famille. Autrement dit on cherche
trois r´eels λ1; λ2 et λ3 tels que
λ1 · (1; 1; 2) + λ2 · (−1; 0; 1) + λ3 · (2; 1/3; . −1) = (x; y; z) .
Il s’agit donc de savoir si le syst`eme



λ1 −λ2 + 2λ3
=
x;
λ1 + 1/3λ3
=
y;
2λ1 + λ2 −λ3
=
z
d’inconnues λ1; λ2 et λ3 admet une solution. Pour cela on utilise l’algorithme du pivot de Gauss
qui donne le syst`eme ´equivalent



λ1 −λ2 + 2λ3
=
x;
λ2 −λ3
=
y −x;
0
=
z −3y + x
Ce syst`eme n’est compatible que si z−3y+x = 0. Donc la famille ((1; 1; 2); (−1; 0; 1); (2; 1/3; −1))
n’est pas g´en´eratrice de R3 : si z−3y+x ̸= 0, le vecteur (x; y; z) de R3 ne s’´ecrit pas comme com-
binaison lin´eaire des vecteurs de cette famille. Au passage, on r´ecup`ere une ´equation cart´esienne
de
F = V ect((1; 1; 2); (−1; 0; 1); (2; 1/3; −1)) : (x; y; z) ∈F ⇐⇒z −3y + x = 0.
1.5
Familles libres
D´eﬁnition 1.5.1 On dit que la famille (u1; u2; . . . ; un) de vecteurs d’un espace vectoriel (E; +; ·)
est libre lorsque sa seule combinaison lin´eaire nulle est celle dont tous les coeﬃcients sont nulls
c’est-`a-dire :
λ1u1 + λ2u2 + . . . + λnun = 0E ⇐⇒λ1 = λ2 = . . . = λn = 0.
8


---

## Page 12

Exemple 1.5.1 Dans Rn[X], la famille (1; X; . . . ; Xn) est libre. En eﬀet supposons que
λ0 · 1 + λ1 · X + . . . + λn · Xn = 0.
Cela signiﬁe que le polynˆome P(X) = λ0 + λ1 · X + . . . + λn · Xn est la fonction nulle, donc
a une inﬁnit´e de racines. Ce n’est possible que si tous les coeﬃcients sont nuls, i.e. λ1 = λ2 =
. . . = λn = 0
Exemple 1.5.2 Soit a ∈R. Dans R3, la famille ((1; 1; 2); (−1; 0; 1); (2; a; −1)) est-elle libre ?
Pour le savoir, on suppose qu’il existe trois r´eels λ1; λ2 et λ3 tels que
λ1 · (1; 1; 2) + λ2 · (−1; 0; 1) + λ3 · (2; a; −1) = 0R3.
Cela signiﬁe que (λ1; λ2; λ3) est une solution du syst`eme



λ1 −λ2 + 2λ3
=
0;
λ1 + aλ3
=
0;
2λ1 + λ2 −λ3
=
0
Il s’agit donc de connaˆıtre l’ensemble des solutions du syst`eme pr´ec´edent. Pour cela on
utilise une fois de plus l’algorithme du pivot de Gauss et on obtient :



λ1 −λ2 + 2λ3
=
0
λ2 + (a −2)λ3
=
0
(1 −3a)λ3
=
0
Ou bien a ̸= 1
3 et le syst`eme a pour unique solution (λ1; λ2; λ3) = (0; 0; 0), ou bien a = 1
3 et le
syt`eme a une inﬁnit´e de solutions autres que (0; 0; 0).
Conclusion : la famille ((1; 1; 2); (−1; 0; 1); (2; a; −1)) est libre si et seulement si a ̸= 1
3.
Remarque 1.5.1 Il est important de noter que pour d´eterminer si une famille est g´en´eratrice,
on s’est pos´e la question de l’existence de solutions pour un syst`eme lin´eaire, et que d’autre part
pour savoir si une famille est g´en´eratrice, il s’est agit de savoir si un syst`eme lin´eaire admet
une unique solution ou bien plusieurs solutions.
1.6
Bases d’un espace vectoriel
1.6.1
D´eﬁnition, exemples
D´eﬁnition 1.6.1 On dit que la famille ﬁnie B = (u1; u2; . . . ; un) de vecteurs d’un espace vec-
toriel (E; +; ·) est une base de E lorsque B est libre et g´en´eratrice.
Exemple 1.6.1 Dans Rn, on note e1 = (1; 0; . . . ; 0), e2 = (0; 1; 0; . . . ; 0), . . . , en = (0; . . . ; 0; 1).
La famille (e1; . . . ; en) est une base, qu’on appelle base canonique de Rn.
Prouvons que cette famille est g´en´eratrice. Soit (x1; x2; . . . ; xn) un vecteur de Rn. On cherche
λ1; . . . ; λn dans R tels que
λ1 · e1 + . . . + λn · en = (x1; x2; . . . ; xn)
Puisque
λ1 · e1 + . . . + λn · en = (λ1; . . . ; λn),
9


---

## Page 13

il suﬃt de prendre λj = xj pour tout j ∈{1; . . . ; n}.
On montre maintenant que (e1; . . . ; en) est une famille libre. Supposons que
λ1 · e1 + . . . + λn · en = 0Rn = (0; . . . ; 0).
Encore une fois puisque λ1 · e1 + . . . + λn · en = (λ1; . . . ; λn), cette ´egalit´e entraine λ1 = . . . =
λn = 0.
Exemple 1.6.2 Dans Rn[X], on a d´ej`a vu que la famille (1; X; . . . ; Xn) est g´en´eratrice (c’est la
d´eﬁnition de Rn[X]), et libre. C’est donc une base de Rn[X], appel´ee elle aussi base canonique,
de Rn[X] cette fois.
1.6.2
Dimension d’un espace vectoriel
On commence par un r´esultat dont la preuve est un peu longue, mais qui a beaucoup de
cons´equences importantes.
Proposition 1.6.1 Soit (E; +; ·) un espace vectoriel. On suppose que E admet
— une famille g´en´eratrice (u1; u2; . . . ; un),
— une famille libre (v1; v2; . . . ; vp).
Alors n´ecessairement p ⩽n. De plus, si p = n, alors (u1; u2; . . . ; un) et (v1; v2; . . . ; vp) sont des
bases de E.
Preuve : Admise
Proposition 1.6.2 Si E admet une base, alors toutes les bases de E ont le mˆeme nombre
d’´el´ements.
Preuve: Soit (u1; u2; . . . ; un) une base de E ; c’est donc une partie g´en´eratrice `a n ´el´em´ents, et
une partie libre `a n ´el´em´ents. Si (v1; v2; . . . ; vp) est une autre base de E, c’est une partie libre
donc, d’apr`es la proposition pr´ec´edente, p ⩽n, et c’est une partie g´en´eratrice, donc, encore
avec la proposition pr´ec´edente, p ⩾n.
□
D´eﬁnition 1.6.2 Soit (E; +; ·) un espace vectoriel non nul. S’il existe une base de E, on
appelle dimension de E, et on note dimE, le nombre commun d’´el´ements de toutes les bases de
E. Sinon on dit que E est de dimension inﬁnie, et on note dimE = +∞.
Remarque 1.6.1 L’espace vectoriel E = {0E} n’admet pas de famille libre puisque toute fa-
mille de E contient 0E. Par convention, on dit pourtant que E a pour dimension 0. Par analogie
avec la situation dans E = R3, les sous-espaces vectoriels de dimension 1 sont appel´es ”droites”,
et les les sous-espaces vectoriels de dimension 2 sont appel´es ”plans”. Les sous-espaces vectoriels
de dimension n −1 d’un espace de dimension n sont appel´es hyperplans.
Proposition 1.6.3 (Dimension et inclusion) Soit E un espace vectoriel de dimension ﬁnie.
Soit V et W deux sous-espaces vectoriels de E, tels que V ⊂W. Alors V et W sont de
dimension ﬁnie et dimV ⩽dimW. De plus V = W si et seulement si dimV = dimW.
Preuve: : Admise
□
10


---

## Page 14

1.7
Coordonn´ees d’un vecteur
Th´eor`eme 1.7.1 (Dimension d’un espace vectoriel de dimension ﬁnie) : Soit E un
K−espace vectoriel de dimension ﬁnie n. Notons B = {−→v 1, −→v 2, . . . , −→v n} une base (famille libre
et g´en´eratrice) de E.
Tout vecteur de E s’´ecrit de fa¸con unique comme combinaison lin´eaire des vecteurs de B,
i.e. ∀⃗X ∈E, ∃!(x1, x2, . . . , xn) ∈Kn tel que
⃗X = x1−→v 1 + x2−→v 2 + . . . + xn−→v n =
n
X
i=1
xi−→v i
Les scalaires x1, x2, . . . , xn sont appel´es coordonn´ees du vecteur ⃗X dans la base B, on note :
X =




x1
x2
. . .
xn




B
Exemple 1.7.1
1. Montrer que la famille B(u1, u2, u3, u4) est une base de R4 avec u1 =
(0, 1, 1, 1), u2 = (1, 0, 1, 1), u3 = (1, 1, 0, 1) et u4 = (1, 1, 1, 0).
2. Calculons les cordonn´ees du vecteur X = (−1, 2, −1, 2) par rapport `a cette base.
Solution
1. . . .
2. D’apr`es la d´eﬁnition pr´ec´edente, on cherche quatre scalaires x1, x2, x3, x4 tels
X = x1u1 + x2u2 + x3u3 + x4u4
On obtient alors syst`eme lin´eaire suivant :







x2 + x3 + x4
=
−1
x1 + x3 + x4
=
2
x1 + x2 + x4
=
−1
x1 + x2 + x3
=
2
=⇒x1 = 5
3, x2 = −4
3, x3 = 5
3, x3 = −4
3
On ´ecrit alors
X =




5/3
−4/3
5/3
−4/3




B
1.8
Comment extraire une base d’une famille g´en´eratrice ?
Exemple 1.8.1 Soit v1 = (1; 2; 3; 0), v2 = (0; 2; 2; 4) et v3 = (−1; a; 2a −3; 4a) trois vecteurs
de R4, et F = V ect(v1; v2; v3). Par d´eﬁnition, la famille (v1; v2; v3) est une famille g´en´eratrice
de F, et on veut trouver une base de F. Si la famille (v1; v2; v3) est libre, c’est une base. Or
l’´equation
λ1v1 + λ2v2 + λ3v3 = 0; ´equivaut au syst`eme







λ1
−λ3
=
0
2λ1
+2λ2
+aλ3
=
0
3λ1
+2λ2
+(2a −3)λ3
=
0
4λ2
+4aλ3
=
0
11


---

## Page 15

Avec l’algorithme du pivot de Gauss, on obtient le syst`eme ´echelonn´e ´equivalent :



λ1 −λ3 = 0
2λ2 + (a + 2)λ3 = 0
(a −2)λ3 = 0
.
Donc si a ̸= 2, le syst`eme admet une unique solution (0; 0; 0). Donc (v1; v2; v3) est une base
dans ce cas.
Si a = 2, le syst`eme admet une inﬁnit´e de solutions, donc (v1; v2; v3) n’est pas une famille
libre. Mais on peut dire plus : λ3 peut ˆetre consid´er´e comme un param`etre et le syst`eme peut
s’´ecrire
 λ1 = s
λ2 = −2s; λ3 = s
On obtient en particulier v1 −v2 + v3 = 0R3, ou encore v3 = −v1 + 2v2. Donc (v1; v2) est une
famille g´en´eratrice de F : si v ∈F, il existe λ1; λ2; λ3 tels que v = λ1v1 + λ2v2 + λ3v3. Mais
alors
v = λ1v1 + λ2v2 + λ3v3 = λ1v1 + λ2v2 + λ3(−v1 + 2v2) = (λ1 −3λ3)v1 + (λ2 + 2λ3)v2;
ce qui prouve que v s’´ecrit comme combinaison lin´eaire de v1 et v2. Enﬁn (v1; v2) est une famille
libre de F : dans le cas s = 0, la seule solution du syst`eme ci-dessus est λ1 = λ2 = 0.
1.9
Comment trouver une base d’un espace vectoriel
donn´e par un syst`eme d’´equations ?
On sait que l’ensemble des solutions d’un syst`eme homog`ene de n ´equations `a p inconnues est
un sous-espace vectoriel de Rp. On se pose la question d’en trouver une base, et de d´eterminer
sa dimension.
Exemple 1.9.1 Soit
V = {(x1; x2; x3) ∈R3; 2x1 + 3x2 = 0; x1 + x2 + x3 = 0}.
V est l’ensemble des solutions du syst`eme

2x1 + 3x2 = 0
x1 + x2 + x3 = 0
On l’´echelonne avec la m´ethode du pivot de Gauss. On obtient le syst`eme ´equivalent
 2x1 + 3x2 = 0
−1
2x2 + x3 = 0
Les inconnues principales sont x1 et x2. On peut les exprimer en fonction de l’inconnue secon-
daire x3 en ´ecrivant le syst`eme sous forme ´echelonn´ee r´eduite :
 x1 + 3x3 = 0
x2 −2x3 = 0
Autrement dit,
V = {(−3s; 2s; s); s ∈R} = V ect((−3; 2; 1)) .
12


---

## Page 16

Exemple 1.9.2 On d´esigne par F le sous ensemble de R3 d´eﬁni par :
F = {(x, y, z) ∈R3 tq x −y + z = 0}
1. Montrer que F est un sous espace vectoriel de R2
2. D´eterminer une base et la dimension de F
Solution
1. La premi`ere question est la rep´etition d’un exemple pr´ec´edent.
2. Base et dimension de F :
(x, y, z) ∈F
⇐⇒
(x, y, z) ∈R3 et x −y + z = 0
⇐⇒
(x, y, z) ∈R3 et x = y −z
⇐⇒
(x, y, z) ∈R3 et (x, y, z) = (y −z, y, z)
⇐⇒
(x, y, z) = y(1, 1, 0) + z(−1, 0, 1)
On en d´eduit que la famille {(1, 1, 0), (−1, 0, 1)} est une base de F et que dimF = 2
1.10
Travaux dirig´es sur les Espaces vectoriels
Exercice 1.10.1 Montrer que les lois suivantes munissent l’ensemble E indiqu´e d’une struc-
ture de groupe, et pr´eciser s’il est ab´elien.
1. E =] −1, 1[ et la loi ⋆est d´eﬁnie par x ⋆y = x + y
1 + xy.
2. E = R2 et la loi ⋆est d´eﬁnie par (a, b) ⋆(x, y) = (a + x, bex + yea).
Exercice 1.10.2 Parmi les sous-ensembles suivants de R2 ou R3 , pr´ecisez lesquels sont des
R-espaces vectoriels :
1. F1 = {(x, y) ∈R2 : y = 1}
2. F2 = {(x, y) ∈R22 : x + 2y ⩽0}
3. F3 = {(x, y, z) ∈R3 : z = 0} ;
4. F4 = {(x + 1, x + y −2, x −y); (x, y) ∈R2}
5. F5 = {(x, y, z) ∈R3 : x + z = −y}
6. F6 = {(s, 0, 2s + t); (s, t) ∈R2}
Exercice 1.10.3
1. Soit E l’ensemble des (x, y, z) ∈R3 tels que x + 2y −z = 0. Justiﬁer
que E est un R-espace vectoriel.
2. Parmi les ensembles suivants, lesquels sont des sous-espaces vectoriels de E ?
• F1 = {(λ, 3λ, 2λ), λ ∈R}.
• La droite F2 engendr´ee par le vecteur −→v = (3, 1, 5).
• F3 = V ect{(0, 1, 2), (1, −1, −1)}
• F4 = {(λ + 1, λ −1, 3λ −1), λ ∈R}.
Exercice 1.10.4 Soit E d´eﬁni par
E = {(x, y, z) ∈C3, x + y −iz = 0}
13


---

## Page 17

1. Justiﬁer que E est un C-espace vectoriel.
2. Ecrire l’ensemble des solutions de l’´equation x + y - iz = 0 sous forme param´etrique.
3. Donner deux vecteurs qui engendrent E.
Exercice 1.10.5
1. Rappeler la d´eﬁnition d’une famille libre.
2. D´eterminer si chacune des familles suivantes de l’espace vectoriel E est une famille libre.
3. {(1, 2, −1), (5, 3, 2), (3, −1, 4)} dans E = R3 .
4. {(1, −1, 2), (3, −4, 2), (−1, 5, m)} dans E = R3 , en fonction du param`etre m ∈R.
5. {(i, 1 + i, 2), (i −1, 2i, 2 + 2i)} dans le C-espace vectoriel E = C3
6. { (1, 2, -i),(4, 4i, 2),(i, 0, 1)} dans le C-espace vectoriel E = C3.
Exercice 1.10.6
1. Rappeler la d´eﬁnition d’une famille g´en´eratrice d’un espace vectoriel
E.
2. Les familles de vecteurs suivantes sont-elles g´en´eratrices dans l’espace vectoriel E in-
diqu´e ?
(a) {(1, 0), (0, 1), (1, 1), (2, 3)} dans E = R2.
(b) {(1, i), (i, −1), (1 + i, i −1)} dans E = C2.
(c) {(−1, 1, 0), (1, 0, 1)} dans E = {(x, y, z) ∈R3 : x + y −z = 0}.
Exercice 1.10.7
1. Montrer que les vecteurs
x1(0, 1, 1), x2 = (1, 0, 1), x3 = (1, 1, 0)
forment une base de R3. Quelles sont les coordonn´ees du vecteur x = (1, 1, 1) dans cette
base ?
2. Donner, dans R3, un exemple de famille libre qui n’est pas g´en´eratrice.
3. Donner, dans R3, un exemple de famille g´en´eratrice qui n’est pas libre.
Exercice 1.10.8 Dans R4, on consid`ere les vecteurs
e1 = (1, 2, 3, 4), e2 = (1 −2, 3, −4).
Peut-on d´eterminer x, y pour que (x, 1, y, 1) ∈V ect{e1, e2} ? Mˆeme question pour que (x, 1, 1, y) ∈
V ect{e1, e2} ?
Exercice 1.10.9 Montrer que la famille
(1, 1 −X, (1 −X)2, (1 −X)3, (1 −X)4
est une base de R4[X] puis d´eterminer les cordonn´ees du polynˆome
P = 1 + X −2X2 −5X3 + X4
Exercice 1.10.10
1. La famille {V1, V2, V3} o`u
V1 = (1, 1, −1), V2 = (2, 1, 3), V3 = (0, −1, 5)
est-elle libre ? li´ee ? Quelle relation lin´eaire lie ces vecteurs ? Quel est l’espace qu’ils
engendrent ? Donnez-en une base et la dimension.
2. Construire une base de chacun des sous-espaces vectoriels de R4 suivants :
(a) E1 = {(x1, x2, x3, x4) ∈R4/ x1 + x2 = 0, x3 −x4 = 0}
(b) E2 = {(x1, x2, x3, x4) ∈R4, x1 + x2 + x4 = 0, x2 + x3 + x4 = 0}.
14


---

## Page 18

Chapitre 2
Les matrices
Dans tout ce chapitre K = R ou C est l’ensemble des scalaires.
2.1
L’espace vectoriel des matrices
D´eﬁnition 2.1.1 Une matrice A est un tableau rectangulaire pr´esent´e habituellement de la
mani`ere suivante
A =





a11
a12
. . .
a1p
a21
a22
. . .
a2p
...
...
...
...
an1
an2
. . .
anp





Les ligne de la matrices sont les n lignes horizontales :
 a11
a12
. . .
a1p

,
 a21
a22
. . .
a2p

, . . .
 an1
an2
. . .
anp

et les colonnes de la matrices A sont les p listes verticales





a11
a21
...
an1




,





a12
a22
...
an2




, . . . ,





a1p
a2p
c...
anp





Le scalaire (aij, appel´e ”´el´ement ij ” de la matrice A est situ´e dans le tableau `a l’intersection
de la i−`eme ligne et de la j−`eme colonne. En d’autre termes, le premier indice i est le num´ero
de la ligne et le second indice j est cela de la colonne. Dans la pratique la matrice A est not´ee :
A =
 
aij
!
1 ⩽i ⩽j
1 ⩽j ⩽p
Une matrice ayant n lignes et p colonnes est appel´ee ”matrice n×p” le couple (n, p) dimension,
taille ou format de la matrice. L’ensemble des matrices de taille (n, p) `a coeﬃcients dans le
corps K est not´e Mn,p(K).
Matrice colonne, Matrice ligne :
15


---

## Page 19

— Lorsque p = 1 on dit que A est une matrice colonne :





a11
a21
...
an1





— Lorsque n = 1 on dit qu’on a une matrice ligne
 a11
a12
. . .
a1p

Exemple 2.1.1
• Le tableau




1
0
−5
2
−5
10
1
0
0
9
−6
3



est une matrice 4 × 3 et on a par exmple
a13 = −5, a42 = −6, a33 = 0 . . .
ses colonnes sont :




1
2
1
9



,




0
−5
0
−6



,




−5
10
0
3




ce sont des matrices connes. Ses lignes sont :
 1
0
−5

,
 2
−5
10

,
 1
0
0
  9
−6
3

ce sont des matrices lignes.
• La matrice 0 =


0
0
0
0
0
0

est une matrice 3 × 2 dont tous ses coeﬃcients sont nuls. On
l’applelle matrice nulle
2.1.1
Op´erations sur les matices
Egalit´e de deux matrices
On dit que deux matrices A = (aij) et B = (bij) sont ´egales et on ´ecrit A = B lorsque :
• Elles ont la mˆeme taille, c’est-`a-dire mˆeme nombre de lignes et mˆeme nombre de colonnes
• leurs ´el´ements sont ´egaux deux `a deux c’est-`a-dire aij = bij
En d’autres termes l’´egalit´es de deux matrices de taille commune (n, p) se traduit par un syst`eme
de n × p ´egalit´es.
Exemple 2.1.2 D´eterminer x, y, z, t tels que :
x + y
2z + t
x −y
z −t

=
3
7
1
5

Solution:
Par d´eﬁnition de l’´egalit´e de deux matrices, les ´el´ements de mˆemes indices doivent ˆetre ´egaux,
on obtient donc le syst`eme suivanat :







x + y = 3
x −y = 1
2z + t = 7
z −t = 5
=⇒x = 2, y = 1, z = 4, t = −1
16


---

## Page 20

Addition
D´eﬁnition 2.1.2 Soient A = (aij) et B = (bij) deux matrices de mˆeme dimension (n, p)
On d´eﬁnit la somme de A et B la matrice not´ee A + B, comme ´etant la matrice obtenue
additionnant les ´el´ements de mˆeme indice. On a :
A + B = (aij + bij)
En d’autres termes,





a11
a12
. . .
a1p
a21
a22
. . .
a2p
...
...
...
...
an1
an2
. . .
anp




+





b11
b12
. . .
b1p
b21
b22
. . .
b2p
...
...
...
...
bn1
bn2
. . .
bnp




=





a11 + b11
a12 + b12
. . .
a1p + b1p
a21 + b21
a22 + b22
. . .
a2p + b2p
...
...
...
...
an1 + bn1
an2 + bn2
. . .
anp + bnp





Multiplication par un scalaire
D´eﬁnition 2.1.3 Soit A = (aij) une matrice de format (n, p) et λ un scalaire, on d´eﬁnit la
matrice λ·A comme ´etant la matrice de format (n, p) obtenue en multipliant tous les coeﬃcients
de la matrice A par λ c’est-`a-dire
λ · A = (λaij)
en d’autres termes,
λ





a11
a12
. . .
a1p
a21
a22
. . .
a2p
...
...
...
...
an1
an2
. . .
anp




=





λa11
λa12
. . .
λa1p
λa21
λa22
. . .
λa2p
...
...
...
...
λan1
λan2
. . .
λanp




.
Exemple 2.1.3 Soit A =
1
−1
3
0
4
5

et B =
4
6
8
1
−3
−7

. On alors :
▶A + B =
5
4
11
1
1
−2

▶3A =
3
−6
9
0
12
15

▶2A −3B =
−10
−22
−18
−3
17
31

Propri´et´es ´el´ementaires de l’addition et de la multiplication par un scalaire
On note ˜0 la matrice nulle, c’est-`a-dire la matrice dont tous les coeﬃcients sont nuls.
Th´eor`eme 2.1.1 Soient trois matrices A, B et C de mˆeme taille, et deux scalaires α et β.
Alors :
1. (A + B) + C = A + (B + C)
2. A + ˜0 = A
3. A + B = B + A
4. A + (−A) = ˜0
5. α(A + B) = αA + αB
17


---

## Page 21

6. (α + β)A = αA + βA
7. (αβ)A = α(βA)
8. 1 · A = A
Remarque 2.1.1 Ces propri´et´es montrent que l’ensemble Mnp(K), muni de la somme des
matrices et du produit d’une matrice par un scalaire est un espace vectoriel sur K. En fait c’est
un espace vectoriel de dimension ﬁnie n × p. Sa base canonique est la famille des n × p matrice
Eij, 1 ⩽i ⩽n, 1 ⩽j ⩽p o`u Eij est la matrice dont tous les coeﬃcients sont nuls sauf celui
situ´e `a la i−`eme ligne et la j−`eme colonne qui vaut 1.
Produit des matrices
D´eﬁnition 2.1.4 Soient A = (aij) et B = (bkj) deux matrices telles que le nombre de colonnes
de A soit ´egal au nombre de lignes de B, autrement dit, A ∈Mnp(K) et B ∈Mpm(K). Le
produit A.B de la matrice A par la matrice B est la matrice de format (n, m) dont l’´el´ement ij
est obtenu en multipliant la i−`eme ligne de la matrice A par la j−`eme colonne de la matrice
B. En d’autre termes, si on pose
A.B = (cij)
alors, on a :
cij
=
 ai1
ai2
. . .
aip

.





b1j
b2j
...
bpj





=
ai1b1j + ai2b2j + . . . + aipbpj
=
p
X
k=1
aikbkj
Nous insistons sur le fait que le produit AB de la matrice A par la matrice B n’est possible
que si le nombre de colonnes de la matrice A est ´egal au nombre de ligne de la matrice B.
Exemple 2.1.4
(a) D´eterminons la matrice AB si A =
1
3
2
−1

et
2
0
−4
5
−2
6

Puisque A est une matrice 2 × 2 et B une matrice 2 × 3 le produit AB est d´eﬁni et est
une matrice 2 × 3. On a :
AB =
1
3
2
−1
 2
0
−4
5
−2
6

=
17
−6
14
−1
2
−14

(b) Soit A =
1
2
3
4

et B =
5
6
0
−2

On a :
AB =
 5
2
15
10

et
BA =
23
34
−3
−8

Ce dernier exemple montre que le produit matriciel n’est pas commutatif, autrement dit,
AB ̸= BA. Toutefois ce produit v´eriﬁe les propri´et´es suivantes :
Th´eor`eme 2.1.2 Soit λ un scalaire et A, B, C trois matrices v´eriﬁant les conditions
requises pour que les sommes et les produits ci-dessous existent, alors on a :
18


---

## Page 22

(a) (AB)C = A(BC)
(b) A(B + C) = AB + AC
(c) (B + C)A = BA + CA
(d) λ(AB) = (λA)B = A(λB)
(e) ˜0A = A˜0 = ˜0
Transpos´ee d’une matrice
D´eﬁnition 2.1.5 Soit A une matrice de format (n, p). On appelle transpos´ee de la matrice A
la matice not´ee tA de format (p, n) obtenue en ´ecrivant en ligne et dans l’ordre les colonnes de
A, en d’autres termes si A = (aij) alors tA = (aji).
Exemple 2.1.5
t  2
1
5
−1
0
6

=


2
−1
1
0
5
6


et
t  1
−3
−10

=


1
−3
−10


Propri´et´e de la transposition
L’op´eration de transposition d’une matrice poss`ede les propri´et´es suivantes
1. (A + B) =t A +t B
2. t(tA) = A
3. t(λA) = λtA
4. t(AB) =t AtB
2.2
Matrices Carr´ees
Comme son nom l’indique, une matrice carr´ee A est une matrice dont le nombre de lignes
est ´egal au nombre de colonnes. Si ce nombre est ´egal `a n, alors A est une matrice de format
(n, n) ; On dit que A est une matrice carr´ee d’ordre n. L’ensemble des matrices carr´ees d’ordre
n `a coeﬃcients dans K est not´e Mn(K).
On se souvient que la somme et le produit de deux matrices quelconques n’est pas toujours
d´eﬁni ; ce n’est plus vrai pour les matrices carr´ees `a condition bien sˆur qu’elles soient de mˆeme
taille. Plus pr´ecis´ement, les op´erations d’addition, de multiplication par un scalaire, de produit
matriciel et de transposition peuvent ˆetre appliqu´ees sur des matrices n × n, le r´esultat ´etant
encore une matrice n × n.
2.2.1
Diagonale et Trace d’une matrice carr´ee
Soit A = (aij) une matrice carr´ee d’ordre n
D´eﬁnition 2.2.1
• Les ´el´ements de A dont les deux indices sont ´egaux, soit aii sont
appel´es ´el´ements diagonaux de A. L’ensemble form´e de tous ces ´el´ements est appel´e
diagonale principale ou diagonale de A.
• La trace de la matrice A est d´eﬁnie par la somme de ses ´el´ements diagonaux, elle est
not´ee tr(A) :
tr(A) =
n
X
i=i
aii
19


---

## Page 23

Quelques propri´et´es de la trace
Si A = (aij) et B = (bij) sont deux matrices car´ees d’ordre n, et λ un scalaire, alors :
1. tr(A + B) = tr(A) + tr(B)
2. tr(λA) = λtr(A)
3. tr(tA) = tr(A)
4. tr(AB) = tr(BA)
2.2.2
Matrices carr´ees particuli`eres
Matrice identit´e
D´eﬁnition 2.2.2 La matrice identit´e ou la matrice identit´e d’ordre n, not´ee In ou I est la
matrice dont tous les ´el´ements diagonaux sont ´egaux 1 et dont tous les autre ´el´ements son nuls.
On a :
I2 =
1
0
0
1

,
I3 =


1
0
0
0
1
0
0
0
1

,
I4 =




1
0
0
0
0
1
0
0
0
0
1
0
0
0
0
1



, . . .
Proposition 2.2.1 Pour toute matrice carr´ee d’ordre n, on a :
AIn = InA = A
Matrice diagonale
D´eﬁnition 2.2.3 Une matrice A car´ee d’ordre n est dite diagonale lorsque tous ses ´el´ements
non diagonaux sont ´egaux 0. Une matrice diagonale a la forme :
A =





a11
0
. . .
0
0
a22
. . .
0
...
...
...
...
0
0
. . .
ann





Matrices triangulaires
D´eﬁnition 2.2.4 Une matrice carr´ee d’ordre n est dite triangulaire sup´erieure (resp. inf´erieure)
lorsque tous ses ´el´ements situ´es en dessous (resp. au dessus) de la diagonale principale sont
nuls
Les matrices triangulaires sup´erieurs sont de la forme :
A =





a11
a12
· · ·
a1n
0
a22
a2n
...
...
...
...
0
0
· · ·
ann





tandis que celles qui sont triangulaires inf´erieurs sont de la forme :





a11
0
· · ·
0
a21
a22
0
...
...
...
...
an1
an2
· · ·
ann





20


---

## Page 24

2.2.3
Matrices inversibles
D´eﬁnition 2.2.5 Une matrice A carr´ee d’ordre n est dite inversible ou r´eguli`ere s’il existe une
matrice B carr´ee d’ordre n telle que
AB = BA = In
La matrice B lorsqu’elle existe elle est unique et est appel´ee inverse de la matrice A, elles
est not´ee A−1.
Remarque 2.2.1 Si B est l’inverse de A alors A est l’inverse de B.
Exemple 2.2.1 Soient A =
2
5
1
3

et B =
 3
−5
−1
2

. On a :
AB =
2
5
1
3
  3
−5
−1
2

=
1
0
0
1

= I2
et
BA =
 3
−5
−1
2
 2
5
1
3

=
1
0
0
1

= I2
donc le matrices A et B sont inverses l’une de l’autre.
Remarque 2.2.2 Si A et B sont deux matrices carr´ees d’ordre n qui v´eriﬁent AB = In alors
on a n´ecessairement BA = In. Il suﬃt alors d’eﬀectuer le produit dans un seul sens pour
s’assurer si oui ou non les deux matrices sont inverses l’une de l’autre.
Au prochain chapitre nous d´ecrirons une m´ethode de calcul de l’inverse d’une matrice lors-
qu’elle existe.
Exercice 2.2.1 Soit M =


−3
2
2
−2
5
4
1
−5
−4


1. Calculer M 2 et M 3. En d´eduire l’expression de la matrice M 3 + 2M 2 −M −2I3
2. Montrer que M est inversible et calculer son inverse
Solution:
1. On a :
M 2 = M × M =


−3
2
2
−2
5
4
1
−5
−4




−3
2
2
−2
5
4
1
−5
−4

=


7
−6
−6
0
1
0
3
−3
−2


et
M 3 = M 2 × M =


7
−6
−6
0
1
0
3
−3
−2




−3
2
2
−2
5
4
1
−5
−4

=


−15
14
14
−2
5
4
−5
1
−2


On en d´eduit alors que :
M 3 + 2M 2 −M −2I3 = ˜0 matrice nulle
21


---

## Page 25

2. Montrons que M est inversible et calculons son inverse. On a :
M 3 + 2M 2 −M −2I3 = ˜0
⇐⇒
M 3 + 2M 2 −M = 2I3
⇐⇒
M(M 2 + 2M −I3) = 2I3
⇐⇒
1
2M(M 2 + 2M −I3) = I3
⇐⇒
M(1
2(M 2 + 2M −I3)) = I3
⇐⇒
MN = I3
avec N = 1
2(M 2 + 2M −I3). Donc M est inversible et
M −1 = N = 1
2(M 2 + 2M −I3) =


−1
2
−1
−1
−2
9
2
4
1
2
−13
2
−6


□
2.3
Rang d’une matrice
D´eﬁnition 2.3.1 ( Matrice ´echelonn´ee) Une matrice rectangulaire B est dite ´echelonn´ee en
lignes si :
• chaque ligne non nulle de B commence avec strictement plus de 0 que la ligne pr´ec´edente,
et
• les lignes nulles (ne contenant que des 0) de B viennent en bas apr`es les lignes non
nulles.
Proposition 2.3.1 Toute matrice A peut se r´eduire `a une matrice ´echelonn´ee en lignes B par
une suite d’op´erations ´el´ementaires sur les lignes. B est alors appel´ee la forme ´echelonn´ee en
lignes de A.
Exemple 2.3.1 D´eterminons une matrice B ´echelonn´ee en lignes ´equivalente `a la matrice
A =


1
−3
6
2
2
−5
10
3
3
−8
17
4


Solution :....
L’un des concepts fondamentaux en alg`ebre lin´eaire est le rang d’une matrice. Il admet
plusieurs d´eﬁnitions ´equivalentes. En voici l’une d’entre elles.
D´eﬁnition 2.3.2 Soit A une matrice n lignes et p colonnes i.e. A ∈Mnp(K). Notons L1, L2, . . . , Ln
les lignes de A et C1, C2, . . . , Cp ses diﬀ´erentes colonnes. Le rang de A est par d´eﬁnition la di-
mension du sous espace vectoriel de Kp engendr´e par les vecteurs L1, L2, . . . , Ln ; c’est aussi
la dimension du sous espace vectoriel de Kn engendr´e par les vecteurs C1, C2, . . . , Cp Il est
not´e rg(A).
Remarque 2.3.1 Si A ∈Mnp(K) alors :
rg(A) ⩽max{n, p} .
22


---

## Page 26

Th´eor`eme 2.3.1 Le rang d’une matrice A est le nombre de lignes non nulles dans sa forme
´echelonn´ee en lignes.
Exemple 2.3.2 D´eterminer le rang de chacune des matrices suivantes :
A =


1
−3
6
2
2
−5
10
3
3
−8
17
4


B =


0
1
−1
3
0
1
0
2
4
1
0
−2
3
0
1

;
C =


1
3
2
1
4
1
0
1
−1


Solution :
2.4
Travaux dirig´es sur le calcul matriciel
Exercice 2.4.1 On consid`ere la matrice A =


1
−6
8
4
0
7
3
11
22
17
0, 1
8

.
1. Donner le format de A
2. Donner la valeur de chacun des ´el´ements a14, a23, a33 et a32
3. Ecrire la matrice transpos´ee tA de A et donner son format
Exercice 2.4.2 Soit A =
2
5
3
−1

et B =
 7
2
−1
−3

. Calculer A + B, A −B, 3A −4B.
Exercice 2.4.3 Soit A =
x
5
0
2x

et B =
 y
7
−1
3y

.
1. Trouver x et y pour que A + B =
 4
12
−1
17

2. Trouver x et y pour que 2A −4B =
−5
−18
4
−16

Exercice 2.4.4 On consid`ere les matrices A, B et C d´eﬁnies par A =


1
3
−4
2
0
7

, B =


−2
0
−2
1
8
1

et C =


−4
6
−14
7
24
17

. Montrer que la matrice C est une combinaison lin´eaire des
matrices A et B.
Exercice 2.4.5 Eﬀectuer les produits suivants lorsque c’est possible. Lorsque c’est impossible,
dire pourquoi.
1.


2
5
3
6
4
7

×
2
5
4
6

2.
2
5
4
6

×


2
5
3
6
4
7


3.
 −1
4
5

×


0
−1
6
2
4
−2
3
5
3


4.


2
5
0
3
6
3
4
1
2

×


1
−1
2
0
3
5


23


---

## Page 27

5.


1
−1
2
0
3
5

×


2
5
3
6
4
1


6.


1
0
5
2
−1
6
3
4
7

×


2
7
8
0
2
3
4
5
6


Exercice 2.4.6 On consid`ere les matrices
A =


−1
2
4
1
5
1
2
3
5


et
B =


0
1
−1
3
0
1
0
2
4
1
0
−2
3
0
1


Lorsqu’elles ont un sens, calculer les expressions A + B, AB, BA, tBA, B + AB et A + AB.
Exercice 2.4.7 On consid`ere les matrices suivantes :
A =
−6
−7
5
6

;
B =
−2
−3
2
3

et
C =
 2
1
−4
−2

Trouver les expressions de An, Bn et Cn pour tout n ∈N∗.
Exercice 2.4.8 Soit la matrice A =


1
−1
−1
−1
1
−1
−1
−1
1


1. Calculer A2
2. Montrer que A2 = A + 2I.
3. En d´eduire que est inversible puis calculer A−1 .
Exercice 2.4.9 R´epondre par Vrai ou faux. Soient A et B deux matrices carr´ees d’odre n.
1. Si A est inversible et A−1 = B alors B est inversible et B−1 = A.
2. Si A et B sont inversibles et C = AB alors C est inversible et C−1 = A−1B−1.
3. Si AB = 0 alors A = 0 ou B = 0.
4. (A + B)2 = A2 + B2 + 2AB
5. AB + BA = 0 ssi (A + B)2 = A2 + B2 .
6. Si A + B = AB, alors I −A est inversible
Exercice 2.4.10 On pose A =


4
0
2
0
4
2
0
0
2

, I =


1
0
0
0
1
0
0
0
1

et J =


0
0
1
0
0
1
0
0
−1


1. D´eterminer les r´eels a et b tels que A = aI + bJ
2. Calculer J2.
3. Calculer A3, A3, A4 comme combinaison lin´eaire de I et J.
24


---

## Page 28

Chapitre 3
Applications lin´eaires
3.1
D´eﬁnitions et Exemples
D´eﬁnition 3.1.1 Soient E et F deux espaces vectoriels sur le mˆeme corps K. Une application
f de E dans F est dite lin´eaire si elle veriﬁe
(i) ∀⃗u,⃗v ∈E, f(⃗u + ⃗u) = f(⃗u) + f(⃗v)
(ii) ∀⃗u ∈E, ∀λ ∈K, f(λ⃗u) = λf(⃗u)
Remarque 3.1.1 Notons que les propri´et´es (i) et (ii) sont ´equivalentes `a l’unique propi´et´e :
∀⃗u,⃗v ∈E, ∀λ, µ ∈K f(λ⃗u + µ⃗u) = λf(⃗u) + µf(⃗v)
Remarque 3.1.2 Si f est une application lin´eaire de E vers F alors
f(⃗0E) = ⃗0F
En eﬀet, on a ⃗0E = ⃗0E +⃗0E et comme f est lin´eaire, on a alors
f(⃗0E) = f(⃗0E +⃗0E) = f(⃗0E) + f(⃗0E) =⇒f(⃗0E) = f(⃗0E) −f(⃗0E) = ⃗0F
Cette Propri´et´e donne une condition n´ecessaire (mais non suﬃsante) pour qu’une application
soit lin´eaire. Si on remarque que f(⃗0E) ̸= ⃗0F alors on conclut rapidement que f n’est pas
lin´eaire. Par contre, f(⃗0E) = ⃗0F ne suﬃt pas pour conclure que f est lin´eaire.
Notation : L’ensemble des applications lineaires de E dans F est not´e L(E; F). C’est un espace
vectoriel pour les lois usuelles d’addition des applications et de multiplication d’une application
par un scalaire.
Exemple 3.1.1 Montrons que l’application f telle que :
f : R2
−→
R3
(x, y)
7−→
(x −y, x + 2y, 3x −y)
est lin´eaire
Solution:
Montrons que cette application v´eriﬁe les propri´et´e (i) et (ii).
25


---

## Page 29

(i) soit ⃗u = (x, y),⃗v = (a, b) ∈R2, montrons que f(⃗u + ⃗u) = f(⃗u) + f(⃗v) ; On a :
f(⃗u + ⃗v)
=
f
 (x, y) + (a, b)

=
f(x + a, y + b)
=
 (x + a) −(y + b), (x + a) + 2(y + b), 3(x + a) −(y + b)

=
 (x −y) + (y −b), (x + 2y) + (a + 2b), (3x −y) + (3y −b)

=
(x −y, x + 2y, 3x −y) + (a −b, a + 2b, 3a −b)
=
f(⃗u) + f(⃗v)
(ii) soit ⃗u = (x, y) ∈R2, soitλ ∈R, montrons que f(λ⃗u) = λf(⃗u)
f(λ⃗u)
=
f
 λ(x, y)

=
f(λx, λy)
=
 (λx) −(λy), (λx) + 2(λy), 3(λx) −(λy)

=
λ(x −y, x + 2y, 3x −y)
=
λf(⃗u)
Exercice 3.1.1 Montrer que l’application
φ : Rn[X]
−→
Rn+1[X]
P
7−→
(1 −X)P + X2P ′
est lin´eaire. (Ici P ′ est le polynˆome d´eriv´e du polynˆome P.
□
D´eﬁnition 3.1.2 Etant donn´es un espace vectoriel E sur le corps K. Une application lineaire
de E dans E est appel´e endomorphisme de E.
Notation : L’Ensemble des endomorphismes de E se note L(E). C’est un espace vectoriel
pour les lois usuelles d’addition des applications et de multiplication d’une application par un
scalaire.
D´eﬁnition 3.1.3 On consid`ere deux espaces vectoriels E et F sur le corps K.
— On appelle isomorphisme de E sur F toute application lin´eaire f, bijective (injective
et surjective) de E sur F.
— Un automorphisme de E sur E est un endomorphisme bijectif de E
Notations :
1. L’ensemble des isomorphismes de E sur F est not´e Isom(E, F)
2. L’ensemble des automorphismes de e est not´e Aut(E) ou Gl(E) il est aussi appel´e le
groupe lin´eaire de E.
Th´eor`eme 3.1.1 Soient E et F deux K−espacs vectoriels. Si f est un isomorphisme de E
dans F alors son application reciproque f −1 est une application lin´eaire de F vers E. En
r´ealit´e, f −1 ∈Iso(F, E)
26


---

## Page 30

Preuve : Soit f ∈Isom(E, F). f est lin´eaire et bijective. Montrons que sa bijection r´eciproque
f −1 est lin´eaire. Soit alors u, v ∈F et α, β ∈K Montrons f −1(αu + βv) = αf −1(u) + βf −1(v).
Puisque f est bijective, ∃!(x, y) ∈E × E tel que
 u = f(x)
v = f(y)
=⇒
 αu = f(αx)
βv = f(βy) =⇒αu + βv = f(αx) + f(βy)
Comme f est bijective, la derli`ere ´egualit´e entraine (en composant `a gauche et `a droite par
f −1) que :
f −1(αu + βv) = αx + βy
D’autre part,
 u = f(x)
v = f(y)
=⇒
 x = f −1(u)
y = f −1(v)
On obtient alors
f −1(αu + βv) = αf −1(u) + βf −1(v)
Donc f −1 est lin´eaire.
□
D´eﬁnition 3.1.4 Deux espaces vectoriels E et F sont dits isomorphes s’il existe un isomor-
phisme de E sur F.
3.2
Noyau et Image d’une application lin´eaire
D´eﬁnition 3.2.1 Soient E et F deux espaces vectoriels sur le corps K et f une application
lineaire de E dans F.
• On appelle noyau de f et on note ker f ou N(f) l’ensemble des ant´ec´edent du vecteur
nul de F par f, c’es-`a-dire l’ensemble des vecteurs de E qui ont pour image par f le
vecteur nul de F. On a :
ker f = {⃗u ∈E tq f(⃗u) = ⃗0F} = f −1({⃗0F})
• On appelle image de l’application lin´eaire f et on note Im(f) ou I(f), l’ensemble de
toutes les images par f des vecteurs de E. On a :
Im(f) = f(E) = {f(⃗u), ⃗u ∈E} = {⃗v ∈F tq ∃⃗u ∈E, ⃗v = f(⃗u)}
Remarque 3.2.1 ker f est un sous ensemble de E tandis que Im(f) est un sous ensemble de
F.
ker f ⊂E,
Im(f) ⊂F
Mieux, on a :
Th´eor`eme 3.2.1 Soit f une application lin´eaire de E vers F.
— Le noyau de f est un sous espace vectoriel de E
— L’image de f est un sous espace vectoriel de F.
Preuve :
— D’apr`es la remarque 3.1.2 page 25, on a :
f(⃗0E) = ⃗0F =⇒⃗0E ∈ker f et ⃗08F ∈Im(f) =⇒ker f ̸= ∅et Im(f) ̸= ∅
27


---

## Page 31

— Soit ⃗u1⃗u2 ∈ker f, α, β ∈K montrons que α⃗u1 + β⃗u2 ∈ker f. On a
f(α⃗u1 + β⃗u2)
=
f(α⃗u1) + f(β⃗u2)
=
αf(⃗u1) + βf(⃗u2)
car f est lin´eaire
=
α ·⃗0F + β ·⃗0F
car ⃗u1, ⃗u2 ∈ker f (leurs images parf sont nulles)
Donc α⃗u1 + β⃗u2 ∈ker f =⇒ker f est sous espace vectoriel de E.
— Soit ⃗v1⃗v2 ∈Im(f), α, β ∈K montrons que α⃗v1 + β⃗v2 ∈Im(f). Il s’agit alors de trouver
⃗u ∈E tel que f(⃗u) = α⃗v1 + β⃗v2
Puisque ⃗v1,⃗v2 ∈Im(f), il existe deux vecteurs ⃗u1, ⃗u2 ∈E tels que f(⃗u1) = ⃗v1 et
f(⃗u2) = ⃗v2. On alors
α⃗v1 + β⃗v2
=
αf(⃗u1) + βf(⃗u2)
=
f(α⃗u1) + f(β⃗u2)
car f est lin´eaire
=
f(α⃗u1 + β⃗u2)
car f est lin´eaire
Donc, il suﬃt alors de prendre ⃗u = α⃗u1 + β⃗u2 et on a : f(⃗u) = α⃗v1 + β⃗v2. Ceci permet
de conclure que α⃗v1 + β⃗v2 ∈Im(f) =⇒Im(f) est un sous espace vectoriel de F
□
Proposition 3.2.1 Soient E et F deux espaces vectoriels sur le corps K et f une application
lineaire de E dans F. Si E est engendr´e par les vecteurs (⃗v1;⃗v; . . . ;⃗vp) alors Im(f) est le sous
espace vectoriel de F engendr´e par les vecteurs (f(⃗v1), f(⃗v2), . . . , f(⃗vp)
Preuve :
Faire cette preuve `a titre d’exercice.
□
Exemple 3.2.1 On consid`ere l’application g d´eﬁnie par
g : R4
−→
R3
(x, y, z, t)
7−→
(x −y + z + t, 2x −2y + 3z + 4t, 3x −3y + 4z + 5t)
1. Montrer que g est une application lini´eaire
2. D´eterminer une base et la dimension de ker g
3. D´eterminer une base et la dimension de Im(g)
Solution:
1. Montrer que g est lin´eaire est une r´ep´etition d’un des exemples pr´ec´edents. Recopier
cette preuve dans le cadre de cet exemple.
2. Base et dimension de ker g : On rappelle que
ker g = {(x, y, z, t) ∈R4 tq g(x, y, z, t) = 0R3}
28


---

## Page 32

Donc on a :
(x, y, z, t) ∈ker g
⇐⇒
g(x, y, z, t) = 0R3
⇐⇒
(x −y + z + t, 2x −2y + 3z + 4t, 3x −3y + 4z + 5t) = (0, 0, 0)
⇐⇒



x −y + z + t = 0
2x −2y + 3z + 4t = 0
3x −3y + 4z + 5t = 0
⇐⇒
 x −y + z + t = 0
z + 2t = 0
⇐⇒
 x = y + t
z = −2t
⇐⇒
(x, y, z, t) = (y + t, y, −2t, t) = y(1, 1, 0, 0) + t(1, 0, −2, 1)
On conclut alors la famille (e1 = (1, 1, 0, 0), e2 = (1, 0, −2, 1) est une base de ker g et que
dim ker g = 2
3. D´eterminons une base et la dimension de Im(g). On rappelle tout d’abord que :
Im(g) = {(x′, y′, z′) ∈R3, tq ∃(x, y, z, t)ıR4, g(x, y, z, t) = (x′, y′, z′)}
On a donc :
(x′, y′, z′) ∈Im(g)
⇐⇒
∃(x, y, z, t) ∈R4; tq g(x, y, z, t) = (x′, y′, z′)
⇐⇒
(x −y + z + t, 2x −2y + 3z + 4t, 3x −3y + 4z + 5t) = (0, 0, 0)
⇐⇒
∃(x, y, z, t) ∈R4; tq



x −y + z + t = x′
2x −2y + 3z + 4t = y′
3x −3y + 4z + 5t = z′
=⇒
x′ + y′ −z′ = 0
=⇒
z′ = x′ + y′
=⇒
(x′, y′, z′) = (x′, y′, x′ + y′) = x′(1, 0, 1) + y′(0, 1, 1)
On conclut alors la famille (e′
1 = (1, 0, 1), e′
2 = (0, 1, 1) est une base de Im(g) et que
dimIm(g) = 2
Remarque 3.2.2 Pour D´eterminer a dimension et une base de Im(g) on peut aussi utiliser le
Th´eor`eme pr´ec´edent. Puisqu’on sait que la basse canonique {e1, e2, e3, e4} de R4 engendre R4
on a :
Im(g)
=
vect{g(e1), g(e2), g(e3), g(e4)}
=
vect{(1, 2, 3), (−1, −2, −3), (1, 3, 4), (1, 4, 5)}
En suite on ... (la suite `a l’amphi)
Rappels :
Soit h : A −→B une application.
— h est dite injective si et seulement si l’image de deux ´el´ements distincts de A sont deux
´el´ements distincts de B i.e.
h injective
⇐⇒
∀x1, x2 ∈A, x1 ̸= x2 =⇒f(x1) ̸= f(x2)
⇐⇒
∀x1, x2 ∈A, f(x1) = f(x2) =⇒x1 ̸= x2
29


---

## Page 33

— h est dite surjective si et seulement si tout ´el´ement de B poss`ede au moins un ant´ec´edent
par h i.e.
h surjective
⇐⇒
∀y ∈B, ∃x ∈A tq =⇒y = f(x)
⇐⇒
h(A) = B
— h est dite bijective si et seulement si h est injective et surjective ce qui signiﬁe que tout
´el´ement de B poss`ede un unique ant´ec´edent par h i.e.
h bijective
⇐⇒
∀y ∈B, ∃!x ∈A tq =⇒y = f(x)
⇐⇒
h injective et h(A) = B
Th´eor`eme 3.2.2 Soient E et F deux espaces vectoriels sur le corps K et f une application
lineaire de E dans F. Les propositions suivantes sont ´equivalentes :
1. f est injective
2. ker f = {⃗0E}
3. L’mage de toute famille libre de E par f est une famille libre de F
Preuve :
Th´eor`eme 3.2.3 Soient E et F deux espaces vectoriels sur le corps K et f une application
lineaire de E dans F. Les propositions suivantes sont ´equivalentes :
1. f est surjective
2. Im(f) = F
3. L’mage de toute famille g´en´eratrice de E par f est une famille g´en´eratrice de F
Preuve :
3.3
Application lin´eaire en dimension ﬁnie
D´eﬁnition 3.3.1 (Rang application) Soient E et F deux espaces vectoriels sur le corps K
et f une application lineaire de E dans F. On suppose que E ou F est de dimension ﬁnie. On
appelle rang de l’application lin´eaire F le dimension de son image. On note rang(F) et on a :
rang(f) = dimIm(f)
Remarque 3.3.1 Si l’espace vectoriel E est engendr´e par la famille de vecteurs (⃗v1;⃗v; . . . ;⃗vp),
alors d’apr`es la d´eﬁnition pr´ec´edente, on :
rang(f)
=
dimIm(f)
=
dim vect{f(⃗v1), . . . , f(⃗vp)}
Th´eor`eme 3.3.1 (Th´eor`eme du rang) Soient E et F deux espaces vectoriels sur le corps K et
f une application lineaire de E dans F. Si l’espace vectoriel E est de dimension ﬁnie, alors les
sous espaces vectoriels ker f et Im(f) sont de dimension ﬁnie et on a :
DimE = dimIm(f) + dim ker f
(3.3)
30


---

## Page 34

Th´eor`eme 3.3.2 Soient E et F deux espaces vectoriels sur le corps K de dimensions ﬁnies et
f une application lin´eaire de E dans F. Alors on a :
1. f est injective ⇐⇒l’image d’une base quelconque de E est une famille libre de F
2. f est surjective ⇐⇒l’image d’une base quelconque de E est une famille g´en´eratrice de
F
3. f est bijective ⇐⇒l’image d’une base queconque de E est une base de F. Dans ce cas
E et F ont la mˆeme dimension
Le th´eor`eme suivant est une cons´equence du pr´ec´edent
Th´eor`eme 3.3.3 Soient E un espace vectoriels sur le corps K de dimension ﬁnie et f un
endomorphisme de E ( une application lin´eaire de E dans E. Alors on a les propositions
suivantes sont ´equivalentes :
1. f est un automorphisme
2. ker f = {⃗0E}
3. Im(f) = E
4. L’image par f d’une base de E est une base de F
5. rang(f) = dimE
Preuve: Admise
□
3.4
Matrice d’une application lin´eaire
Soient E un K−espace vectoriel de dimension p muni d’une base B = (e1, . . . , ep) et F
un K−espace vectoriel de dimension n muni d’une base B′ = (e′
1, ..., e′
n). Soit encore f une
application lin´eaire de E vers F.
D´eﬁnition 3.4.1 On appelle matrice de l’application lin´eaire f par rapport aux bases B et B′
la matrice `a n lignes et p colonnes not´ee M(f, B, B′) dont la i-`eme colonne est constitu´ee par
les coordonn´ees du vecteur f(ei) dans la base B′ :
Formulaire :
Si pour tout i ∈{1, 2, . . . , p}, on a
f(ei) =
n
X
i=1
ajiuj
alors on a :
f(e1)
f(e2)
. . .
f(ep)
↓
↓
↓
M(f, B, B′)
=





a11
a12
. . .
a1p
a21
a22
. . .
a2p
...
...
...
...
an1
an2
. . .
anp





←e′
1
←e′
2
...
←e′
n
Remarque 3.4.1 Lorsque f est une endomorphisme (E = F) et si B = B′ alors on ´ecrit
M(f, B) au lieu de M(f, B, B′) et on dit que c’est la matrice de l’endomorphisme f par rapport
`a la base B
31


---

## Page 35

Exemple 3.4.1 On consid`ere l’application lin´eaire f d´eﬁnie par :
f : R2
−→
R3
(x, y)
7−→
(x −y, x + 2y, 3x −y)
Ecrire la matrice de l’application lin´eaire f par rapport aux bases canoniques de R2 et R3
Solution:
Notons B = {e1 = (1, 0), e2 = (0, 1)} la base canonique de R2 et B′ = {e′
1 = (1, 0, 0), e′
2 =
(0, 1, 0), e′
3 = (0, 0, 1)} celle de R3. On a :



f(e1) = (1, 1, 3) = e′
1 + e′
2 + 3e′
3
f(e2) = (−1, 2, −1) = −e′
1 + 2e′
2 −e′
3
=⇒M(f, B, B′) =


1
−1
1
2
3
−1


□
Exemple 3.4.2 Ecrire la matrice de l’endomorphisme
φ : Rn[X]
−→
R3[X]
P
7−→
(1 −X)P ′ + X2P ′′
par rapport `a la base canonique de R3[X]. N.B Ici P ′ est la d´eriv´ee premi`ere de P et P ′′ la
d´eriv´ee seconde de de P
Solution:
La base canonique de R3[X] est la famille {1, X, X2, X3}. On alors







φ(1) = 0
φ(X) = 1 −X
π(X2) = 2X
φ(X3) = 3X2 + 3X3
=⇒M(f, B) =




0
1
0
0
0
−1
2
0
0
0
0
3
0
0
0
3




□
Remarque 3.4.2
▶Si dimE = p et dimF = n alors M(f, B, B′) est une matrice rectangulaire de format
n × p i.e.
M(f, B, B′) ∈Mn,p(K)
▶Si X est le vecteur colonne repr´esentant les coordonn´ees du vecteur ⃗x dans la base B, si
Y est le vecteur colonne repr´esentant les coordonn´ees du vecteur ⃗y = f(⃗u) dans la base
B′, et si A est la matrice de l’application lin´eaire f par rapport aux bases B et B′, alors
Y = AX i.e.
⃗y = f(⃗u) ⇐⇒Y = AX
Exercice 3.4.1 On d´esigne par φ l’endomorphisme de R3 dont la matrice par rapport `a la base
canonique de R3 est
A =


1
1
2
−2
1
−1
1
3
4


32


---

## Page 36

1. Calculer φ(x, y, z) en fonction de x, y et z.
2. D´eterminer le noyau et l’image de φ. On pr´ecisera dans chaque cas une base et la di-
mension
3. On pose u1 = (0, 1, 1), u2 = (1, 0, 1) et u3 = (1, 1, 0). Montrer que la famille {u1, u2, u3}
est une base de R3. Ecrire la matrice de l’endomorphime φ par rapport `a cette nouvelle
base
Solution:
1. D’apr`es le second item de la remarque pr´ec´edente, on a :
(x′, y′, z′) = φ(x, y, z)
⇐⇒


x′
y′
z′

=


1
1
2
−2
1
−1
1
3
4




x
y
z


⇐⇒



x + y + 2z
=
x′
−2x + y −z
=
y′
x + 3y + 4z
=
z′
On ´ecrit alors :
φ(x, yxz) = (x + y + 2z, −2x + y −z, x + 3y + 4z)
2. Noyau de φ : On a
(x, y, z) ∈ker(φ)
⇐⇒
φ(x, y, z) = (0, 0, 0)
⇐⇒


1
1
2
−2
1
−1
1
3
4




x
y
z

=


0
0
0


⇐⇒



x + y + 2z
=
0
−2x + y −z
=
0
x + 3y + 4z
=
0
⇐⇒



x
=
−z
y
=
−z
z
=
z
⇐⇒
(x, y, z) = (−z, −z, z)
⇐⇒
(x, y, z) = z(−1, −1, 1)
On conclut alors que
ker(φ) = vect{e1 = (−1, −1, 1)}
et dim ker(φ) = 1
Image de φ : Puisque la base canonique engendre R3, les images de cette famille
33


---

## Page 37

engengrent Im(φ). On a :
Im(φ)
=
vect{φ(1, 0, 0), φ(0, 1, 0), φ(0, 0, 1)}
=
vect





1
−2
1

,


1
1
3

,


2
−1
4

,



=
vect





1
−2
1

,


0
3
2

,


0
3
2

,



=
vect





1
−2
1

,


0
3
2

,


0
0
0

,



On conclut alors que :
Im(φ) = vect{e2 = (1, −2, 1), e3 = (0, 3, 2)} =⇒dim Im(φ) = 3
Deuxi`eme m´ethode : Voir `a l’amphi
3. Puisque dimR3 = 3, pour montrer que la famille {u1, u2, u3} est une base de R3 il suﬃt
de montrer que c’est une famille lin´eairement ind´epedante. (Ce que chacun peut faire `a
ce stade du cours)
Matrice de φ par rapport `a cette base : Par d´eﬁnition, pour obtenir cette matrice
il faut calculer φ(u1), φ(u2) et φ(u3) est fonction de u1, u2 et u3. On a :
φ(u1) = (3, 0, 7)
=
au1 + bu2 + cu3
=
(b + c, a + c, a + b)
=⇒



b + c = 3
a + c = 0
a + b = 7
=⇒



a = 2
b = 5
c = −2
On a donc :
φ(u1) = 2u1 + 5u2 −2u3
De mˆeme,
φ(u2) = (3, −3, 5)
=
au1 + bu2 + cu3
=
(b + c, a + c, a + b)
=



b + c = 3
a + c = −3
a + b = 5
=



a = −1/2
b = 11/2
c = −5/2
On a donc :
φ(u2) = −1
2u1 + 11
2 u2 −5
2u3
34


---

## Page 38

De mˆeme
φ(u3) = (2, −1, 4)
=
au1 + bu2 + cu3
=
(b + c, a + c, a + b)
=



b + c = 2
a + c = −1
a + b = 4
=



a = 1/2
b = 7/2
c = −3/2
On a donc :
φ(u3) = 1
2u1 + 7
2u2 −3
2u3
On obtient alors :
M(φ, B) = 1
2


4
−1
1
10
11
7
−4
−5
−3


Remarque : Au paragraphe suivant nous d´ecrirons une m´ethode plus directe de calcul
de cette matrice.
Th´eor`eme 3.4.1
• Si f est une application lin´eaire de E dans F et si A est la matrice
de f par rapport `a des bases queconques de E et F, alors
dimIm(f) = rg(f) = rg(A)
• Si f est un endomorphisme d’un espace vectoriel de dimension ﬁnie n, B une base de
E et f un endomorphisme de E, de matrice A par rapport `a la base B alors on a :
fest un automorphisme de E ⇐⇒rg(A) = n ⇐⇒det(A) ̸= 0
3.5
Fiche de TD sur les applications lin´eaires
Exercice 3.5.1 Lesquelles des applications suivantes sont-elles lin´eaires ?
f : R2 −→R2
(x, y) 7−→f(x, y) = (x + y, x) ;
g : R3 −→R3
(x, y, z) 7−→g(x, y, z) = (x2 + y2, z, y) ;
h : R3 −→R
(x, y, z) 7−→h(x, y, z) = 2x + 3y −z ;
ℓ: R2 −→R
(x, y) 7−→ℓ(x, y) = xy ;
m : R3[X] −→R
P 7−→m(P) = (P(−1), P(0), P(1))
Exercice 3.5.2 On consid`ere l’application
f : R3 −→R3
(x, y, z) 7−→f(x, y, z) = (x + 2y −z, y + z, x + y −2z) .
35


---

## Page 39

1. V´eriﬁer que f est lin´eaire
2. D´eterminer le noyau de cette application. Donner sa dimension ainsi qu’une base.
3. D´eterminer l’image de cette application. Donner sa dimension ainsi qu’une base.
4. D´eterminer la matrice de f relativement `a la base canonique de R3.
Exercice 3.5.3 Soit h l’application lin´eaire de R3 dans R2 d´eﬁnie par rapport `a deux bases
(e1, e2, e3) et (f1, f2) par la matrice A =
 2
−1
1
3
2
−3

1. On prend dans R3 la nouvelle base :e′
1 = e2 + e3, e′
2 = e3 + e1, e′
3 = e1 + e2. Quelle est
la nouvelle matrice A1 de h ?
2. On choisit pour R2 les vecteurs f ′
1 = 1
2(f1 + f2), f ′
2 = 1
2(f1 −f2). En conservant la base
(e′
1, e′
2, e′
3) dans R3, quelle est la nouvelle matrice A2 de h ?
Exercice 3.5.4 Soient trois vecteurs e1, e2, e3 formant une base de R3. on note T la transfor-
mation lin´eaire d´eﬁnie par : T(e1) = T(e3) = e3, T(e2) = −e1 + e2 + e3.
1. D´eterminer le noyau de cette application lin´eaire. Ecrire la matrice A de T dans la base
(e1, e2, e3).
2. On pose f1 = e1 −e3, f2 = e1 −e2, f3 = −e1 + e2 + e3. Calculer e1, e2, e3 en fonction
f1, f2, f3. Les vecteurs f1, f2, f3 forment-ils une base de R3 ?
3. Calculer T(f1), T(f2), T(f3) en fonction de f1, f2, f3. Ecrire la matrice B de T dans la
base (f1, f2, f3) et trouver la nature de l’application T.
4. On pose P =


1
1
−1
0
−1
1
−1
0
1

. V´eriﬁer que P est inversible et calculer P −1. Quelle
relation lie les quatre matrices A, B, P, P −1 ?
Exercice 3.5.5
1. D´eterminer une application lin´eaire f : R3 −→R4 donc l’image est
engendr´ee par les vecteurs u = (1, 2, 0, −4) et v = (2, 0, −1, −3).
2. Une telle application peut-elle ˆetre injective ? Surjective ?
Exercice 3.5.6 On consid`ere l’application
f : R3 −→R3
(x, y, z) 7−→f(x, y, z) = (2x, −4x + 5y −2z, −5x + 4y −z) .
1. Montrer que f est lin´eaire. D´eterminer son noyau son image et son rang.
2. Ecrire la matrice de f relativement `a la base canonique de R3.
3. On pose pour λ ∈R, Eλ = {(x, y, z) ∈R3 / f(x, y, z) = λ(x, y, z)} .
(a) Montrer que Eλ est un sous espace vectoriel de R3.
(b) Pour quelle valeurs de λ, le sous espace vectoriel Eλ n’est pas r´eduit au singleton
vecteur nul de R3 ?
(c) Pour chacune des valeurs de λ trouv´ees `a la question pr´ec´edente, d´eterminer une
base et la dimension de Eλ.
(d) Montrer que la famille {(0, 1, 2), (1, 2, 1), (0, 1, 1)} est une base de R3 puis ´ecrire la
matrice de f relativement `a cette base.
36


---

## Page 40

Exercice 3.5.7
1. D´eterminer une application lin´eaire f : R3 −→R4 donc l’image est
engendr´ee par les vecteurs u = (1, 2, 0, −4) et v = (2, 0, −1, −3).
2. Une telle application peut-elle ˆetre injective ? Surjective ?
Exercice 3.5.8 On consid`ere l’application
f : R3 −→R3
(x, y, z) 7−→f(x, y, z) = (2x, −4x + 5y −2z, −5x + 4y −z) .
1. Montrer que f est lin´eaire. D´eterminer son noyau son image et son rang.
2. Ecrire la matrice de f relativement `a la base canonique de R3.
3. On pose pour λ ∈R, Eλ = {(x, y, z) ∈R3 / f(x, y, z) = λ(x, y, z)} .
(a) Montrer que Eλ est un sous espace vectoriel de R3.
(b) Pour quelle valeurs de λ, le sous espace vectoriel Eλ n’est pas r´eduit au singleton
vecteur nul de R3 ?
(c) Pour chacune des valeurs de λ trouv´ees `a la question pr´ec´edente, d´eterminer une
base et la dimension de Eλ.
(d) Montrer que la famille {(0, 1, 2), (1, 2, 1), (0, 1, 1)} est une base de R3 puis ´ecrire la
matrice de f relativement `a cette base.
37


---

## Page 41

Chapitre 4
Les D´eterminants des Matrices carr´ees
Dans tout ce chapitre, K d´esignera l’ensemble des nombres r´eels R ou l’ensemble C des
nombres complexes.
4.1
D´eﬁnition r´ecursive du d´eterminant
Notation
Soit A = (aij)1⩽i,j⩽n =







a11
. . .
a1j
. . .
a1p
...
. . .
...
. . .
...
ai1
. . .
aij
. . .
aip
...
. . .
...
. . .
...
an1
. . .
anj
. . .
anp







une matrice carr´ee d’ordre n `a coeﬃcients
dans K. On notera f
Mi,j la matrice obtenue en supprimant la i-`eme ligne et la j-`eme colonne de
la matrice A.
D´eﬁnition 4.1.1 (D´eterminant d’une matrice carr´ee.) On d´eﬁnit de mani`ere r´ecursive le
d´eterminant de matrice carr´ee A not´e det(A) =

a11
. . .
a1j
. . .
a1p
...
. . .
...
. . .
...
ai1
. . .
aij
. . .
aip
...
. . .
...
. . .
...
an1
. . .
anj
. . .
anp

de la fa¸con sui-
vante :
• Le d´eterminant de la matrice carr´ee 1 × 1, A = (a11), est le scalaire a11 lui-mˆeme, soit
det A = |a11| = a11
.
• Le d´eterminant d’une matrice carr´ee d’ordre 2 est d´eﬁni comme suit :

a11
a12
a21
a22
 = a11a22 −a12a21
• Le d´eterminant d’une matrice carr´ee d’ordre 2 est par d´eﬁnition ´egale `a (pour tout
i ∈{1, 2, . . . , n}) :
det(A) = (−1)i+1ai1 det( eAi1) + (−1)i+1ai2 det( eAi2) + . . . + (−1)i+nai1 det( eAin)
(4.1)
38


---

## Page 42

Exemple 4.1.1 Pour A =


a11
a12
a13
a21
a22
a23
a31
a32
a33

on a :
det(A)
=
a11

a22
a23
a32
a33
 −a12

a21
a23
a31
a33
 + a13

a21
a22
a31
a32

=
−a21

a12
a13
a32
a33
 + a22

a11
a13
a31
a23
 −a23

a11
a12
a31
a32

=
. . .
En particulier,

2
3
4
5
6
7
8
9
1

=
2

6
7
9
1
 −3

5
7
8
1
 + 4

5
6
8
9

=
. . .
Remarque 4.1.1
— La formule 4.1 est ind´ependante de i c’est-`a-dire de la ligne choisie.
On l’appelle d´eveloppement de Laplace du d´eterminant de A selon la i-`eme ligne. On
choisit alors n’impote quelle ligne pour eﬀectuer ce d´eveloppement.
— De mˆeme cette formule ne change si on choisit plutˆot la j-`eme colonne ; on dira alors
qu’on a d´eveloppement de Laplace du d´eterminant de A selon la j-`eme colonne.
— Dans la pratique, on choisit la ligne ou la colonne qui contient le maximum de 0.
Exemple 4.1.2 Calculer les d´eterminants suivants :

−1
2
−5
7
 ;

2
3
4
5
6
7
8
9
1

et

−1
2
0
4
0
2
−2
0
−5
0
−6
0
1
2
−1
4

Solution :
On a :

−1
2
−5
7
 = −7 + 10 = 3
On d´eveloppe le second d´eterminant par rapport `a la premi`ere ligne et on trouve

2
3
4
5
6
7
8
9
1

=
2

6
7
9
1
 −3

5
7
8
1
 + 4

5
6
8
9

=
. . .
On d´eveloppe le troisi`eme d´eterminant par rapport `a la derni`ere colonne et on trouve :

−1
2
0
4
0
2
−2
0
−5
0
−6
0
1
2
−1
4

=
−4

0
2
−2
−5
0
−6
1
2
−1

+ 4

−1
2
0
0
2
−2
−5
0
−6

=
. . .
39


---

## Page 43

4.2
Propri´et´es des d´eterminants
Nous pr´esentons ici quelques propri´et´es des d´eterminants.
Th´eor`eme 4.2.1 Le d´eterminant d’une matrice A et celui de sa transpos´ee tA sont ´egaux :
det tA = det A
.
Grˆace `a ce th´eor`eme, tout th´eor`eme sur le d´eterminant, relatif aux lignes d’une matrice A, a
son ´equivalent pour les colonnes de A.
Th´eor`eme 4.2.2 Soit A une matrice carr´ee.
— Si A a une ligne (ou une colone) nulle,alors det A = 0
— Si A a deux lignes (ou colones) identiques, alors det A = 0
— Si une ligne (resp. colonne) de A est une combinaison lin´eaire des autres alors det A = 0
— Si A est triangulaire, autrement dit si tous les ´el´ements au-dessus ou au-dessous de la
diagonale sont nuls, alors det A est ´egal au produit des ´el´ements diagonaux.En particu-
lier, det In = 1, ou I est la matrice unit´e.
Le th´eor`eme suivant, montre comment se transforme le d´eterminant par une op´eration ´el´ementaire
sur les lignes ou les colones.
Th´eor`eme 4.2.3 On consid`ere une matrice B obtenue `a partir d’une matrice A par une
op´eration ´el´ementaire sur les lignes (respectivement sur les colonnes)
— Si l’on ´echange deux lignes (resp colonnes) de A, alors det B = −det A ;
— Si l’on multiplie une ligne(resp colonnes) de A par un scalaire k, alors det B = k det A ;
— Si l’on ajoute un multiple d’une ligne (resp.colone) de A `a une autre ligne(resp colone)
de A, alors det B = det A
Exemple 4.2.1 Calculer le d´eterminant

2
5
−3
−2
−2
−3
2
−5
1
3
−2
2
−1
−6
4
3

et

6
2
1
0
5
2
1
1
−2
1
1
1
2
−2
3
3
0
2
3
−1
−1
−1
−3
4
2

Solution:

2
5
−3
−2
−2
−3
2
−5
1
3
−2
2
−1
−6
4
3

c1 ←−c1 −2c3
c2 ←−c2 + 2c3
c3 ←−c3
c4 ←−c4 + c3
=

0
−1
1
−6
0
3
−2
−1
1
3
−2
2
0
−3
2
5

=

−1
1
−6
3
−2
−1
−3
2
5

=

0
1
0
1
−2
−19
−1
2
23

=

1
−19
−1
3

=
−(23 −19) = −4
40


---

## Page 44

Th´eor`eme 4.2.4 (Propri´et´es fondamentales des d´eterminants) Le d´eterminant du point
AB de deux A et B est ´egal produit des d´eterminants :
det(AB) = det A × det B.
En d’autres termes, le d´eterminant est une fonction multiplicative.
4.2.1
D´eterminant d’une famille de vecteurs
Soit E un espace vectoriel de dimension ﬁnie n un corps K, soit B une base de E, et soit
F = {v1, v2, . . . , vn} une famille de n vecteurs de E. On sait que chaque vecteur de la famille
F s’´ecrit comme combinaison lin´eaire des vecteurs de la base B.
D´eﬁnition 4.2.1 On appelle d´eterminant de la famille F dans la base B et on note detB(F) le
d´eterminant de la matrice carr´ee d’ordre n dont les colonnes sont constitu´ees des coordonn´ees
des vecteurs v1, v2, . . . , vn dana la base B.
Th´eor`eme 4.2.5 La famille F est une base de E si et seulement si
det
B (F) ̸= 0
.
4.3
Sous matrices Mineurs et Mineurs principaux
Soit une matrice carr´ee A = (aij) de taille n. Consid´erons r lignes et r colonnes arbitraires
de A. En d’autre termes, consid´erons un ensemble quelconque I = (i1, i2, . . . , ir) d’indices de
lignes et un ensemble J = (j1, j2, . . . , jr) d’indices de colonnes. I et J d´eﬁnissenet une sous
matrice r × r de A que l’on note A(I, J) obtenu en supprimant de A les lignes dont les indices
n’appartiennent pas `a I et les colonnes dont les indices n’appartiennent pas `a J. On alors :
A(I, J) = (ast, s ∈I, t ∈J)
et le d´eterminant det A(I, J) est appel´e mineur d’ordre r de la matrice A et la quantit´e
(−1)i1+i2+...+ir+j1+j2+...+jr det A(I, J)
est appel´ee mineur sign´e correspondant Notons qu’un mineur d’ordre n −1 est un mineur
au sens pr´ec´edemment d´eﬁni et le mineur sign´e correspondant est un cofacteur. De plus si I′ et
J′ d´esignent respectivement les indices des lignes et des colonnes restantes, alors
det A(I′, J′)
est appel´e mineur compl´ementaire de det A(I, J).
Exemple 4.3.1 Soit A = (aij) une matrice carr´ee d’ordre 6, et soit I = {1, 2, 4} et J =
{2, 3, 6}, alors I′ = {3, 5, 6} et J = {1, 4, 5} le mineur correspondant et son mineur compl´ementaire
sont :
det A(I, J) =

a12
a13
a16
a22
a23
a26
a42
a43
a46

et
det A(I′, J′) =

a31
a34
a35
a51
a54
a55
a61
a64
a65

41


---

## Page 45

Mineurs principaux
D´eﬁnition 4.3.1 Un mineur est dit principal si ses indices des lignes et des colonnes sont les
mˆemes, autrement dit, si les ´el´ements diagaunaux du mineurs sont les ´el´ements diagonaux de
la matrice elle mˆeme.
Exemple 4.3.2 Calculer les mineurs principaux d’ordre 2 de la matrice :


1
2
−1
3
5
4
−3
1
2


Solution:
Une matrice carr´ee d’ordre 3 poss`ede exactement 3 mineurs principaux. On a
M1 =

1
2
3
5
 = −1, M2 =

1
−1
−3
−2
 = −5, M3 =

5
4
1
−2
 = −14
4.4
Applications du calcul du d´eterminant
4.4.1
Inverse d’une Matrice
Matrice de cofacteurs et matrice adjointe
Soit A = (aij) une matrice carr´ee sur un corps K, soit Cij le cofacteur de l’´el´ement aij. On
appelle matrice adjointe de A not´ee adj(A), la matrice transpos´ee de la matrice des cofacteurs
de A :
adj(A) =t (Cij)
Exemple 4.4.1 Soit
B =


2
3
−4
0
−4
2
1
−1
5


. D´eterminons la matrice adjointe de B.
Solution:
Les cofacteurs des neuf ´el´elements sont les suivants :
|A11| =

−4
2
−1
5
 = −18, |A12| = −

0
2
1
5
 = 2, |A13| = −

0
1
−4
−1
 = 4
|A21| = −

3
−1
−4
5
 = −11, |A22| =

2
1
−4
5
 = 14, |A23| = −

2
1
3
−1
 = 5
|A31| =

3
−4
−4
2
 = −10, |A32| = −

2
0
−4
2
 = −4, |A33| =

2
0
3
−4
 = −8
L’adjointe de B est la transpos´ee de la matrice des cofacteurs ci-dessus, soit :
adj(B) =


−18
−11
−10
2
14
−4
4
5
−8


42


---

## Page 46

Th´eor`eme 4.4.1 Soit A une matrice carr´ee d’ordre n. Alors on a :
A · (adjA) = (adjA) · A = det A · In .
On en deduit que :
1. La matrice A est inversible ⇐⇒
det A ̸= 0
2. Si la matrice A est inversible ( det A ̸= 0) alors :
A−1 =
1
det Aadj(A)
Remarque 4.4.1 Dans le cas d’une matrice car´ee d’ordre 2, ce r´esultat fournit une formule
facile `a retenir pour l’inverse : Si A =
a
c
b
d

est inversible, c’est-`a-dire si ad −bc ̸= 0 alors
A−1 =
1
ad −bc
 d
−c
−b
a

Exemple 4.4.2 Soit A =
−1
2
5
−8

et B la matrice de l’exemple pr´ec´edent. Montrer que les
matrices A et B sont inversibles et calculer leurs inverses.
Solution:
On a det A = 8 −10 = −2 ̸= 0 =⇒la matrice A est inversible et on a :
A−1 =
−1
2
5
−8
−1
= 1
−2
−8
−2
−5
−1

= 1
2
8
2
5
1

Calculons det B. On a :
det B = −40 + 6 + 0 −16 + 4 + 0 = −46 ̸= 0
Donc B est inversible.
Calculons B−1. D’apr`es le th´eor`eme pr´ec´edent on a :
B−1 =
1
det B adj(B) = −1
46


−18
−11
−10
2
14
−4
4
5
−8


□
4.4.2
D´eterminant d’un syst`eme de n vecteurs en dimension n
Soit E une K−espace vectoriel de dimension n. Soit (u1, u2, . . . , un) une famille de n vecteurs
de E. Notons B = {e1, e2, . . . , en} une base de E.
D´eﬁnition 4.4.1 On appelle d´eterminant du syst`eme (u1, u2, . . . , un), le d´eterminant de la
matrice dont les colonnes sont constitu´ees des coordonn´ees des vecteurs ui, i = 1, . . . , n dans
la base B. Il est not´e :
det(u1, u2, . . . , un).
On le th´eor`eme suivant :
43


---

## Page 47

Th´eor`eme 4.4.2 Soit E une K−espace vectoriel de dimension n. Soit (u1, u2, . . . , un) une
famille de n vecteurs de E. Les propositions suivantes sont ´equivalentes :
1. (u1, u2, . . . , un) est une base de E
2. La famille (u1, u2, . . . , un) est libre
3. la famille (u1, u2, . . . , un) est g´en´eratrice
4. det(u1, u2, . . . , un) ̸= 0
Exemple 4.4.3 Montrer que la famille
(u1 = (−1, 1, 2, −3), u2 = (0, 2, −1, −2), u3 = (1, −1, 2, 4), u4 = (0, 0, 1, 2)
est une base de R4.
Solution:
Puis que la famille (u1 = (−1, 1, 2, −3), u2 = (0, 2, −1, −2), u3 = (1, −1, 2, 4), u4 = (0, 0, 1, 2)
poss`ede 4 vecteurs et que la dimension de R4 est 4, il suﬃt de montrer que cette famille est
libre, il suﬃt alors de montrer que son d´eterminant est non nul. On a :
det(u1, u2, u3, u4) =

−1
0
1
0
1
2
−1
0
2
−1
2
1
−3
−2
4
2

=

−1
0
1
0
1
2
−1
0
2
−1
2
1
−7
0
0
0

= 7

0
1
0
2
−1
0
−1
2
1

= 7

0
1
2
−1

On alors det(u1, u2, u3, u4) = −14 ̸= 0. Cette famille est donc une base de R4.
□
4.5
TD sur le d´eterminant
Exercice 4.5.1 Calculer le d´eterminant de chacune des matrices suivantes :
1.
 7
11
−8
8

2.


1
0
6
3
4
15
5
6
21


3.


1
0
2
3
4
5
5
6
7


4.


1
0
−1
2
3
5
4
1
3


5.


1
2
4
1
3
9
x
x2
x3


6.




0
1
2
3
1
2
3
0
2
3
0
1
3
0
1
2




7.




0
1
1
0
1
0
0
1
1
1
0
1
1
1
1
0




8.




1
2
1
2
1
3
1
3
2
1
0
6
1
1
1
7




Exercice 4.5.2 Soit ∆(x) = det(ai,j(x)) de taille n = 2 ou 3 avec ai,j des fonctions d´erivables.
1. Montrer que ∆′(x) est la somme des n d´eterminants obtenus en rempla¸cant successive-
ment dans ∆(x) chaque colonne par sa d´eriv´ee.
2. Calculer

x + a1
x
x
x
x + a2
x
x
x
x + a3

et

1 + x
1
1
1
1 + x
1
1
1
1 + x

.
Exercice 4.5.3 Calculer

1
1
1
x
y
z
x2
y2
z2

et d´eterminer la condition d’inversibilit´e de la matrice.
44


---

## Page 48

Exercice 4.5.4 La famille (2, 1, 0), (1, 3, 1), (5, 2, 1) est-elle libre ?
Exercice 4.5.5 Calculer le d´eterminant de la matrice suivante :




m
0
1
2m
1
m
0
0
0
2m + 2
m
1
m
0
0
m



.
Calculer alors, suivant la valeur du param`etre m, le rang de cette matrice.
45


---

## Page 49

Chapitre 5
Syst`emes Lin´eaires
5.1
Les diﬀ´erentes pr´esentations d’un syst`eme d’´equations
lin´eaires
5.1.1
Pr´esentation classique
On consid`ere une famille de n × p nombres aij, 1 ⩽i ⩽p, 1 ⩽j ⩽n, puis p nombres
bi, 1 ⩽i ⩽p. On consid`ere le syst`eme d’´equations
(S)









a11x1 + a12x2 + . . . + a1nxn
= b1
a21x1 + a22x2 + . . . + a2nxn
= b2
...
= ...
ap1x1 + ap2x2 + . . . + apnxn
= bp
,
o`u (x1, . . . , xn) ∈Kn. (S) est un syst`eme de p ´equations lin´eaires `a n inconnues (les nombres
x1, . . . , xn).
On peut aussi ne consid´erer qu’il n’y a qu’une inconnue, le n-uplet (x1, . . . , xn).
Le syst`eme est dit homog`ene si et seulement si b1 = . . . = bp = 0.
Le syst`eme homog`ene associ´e au syst`eme (S) est
(Sh)









a11x1 + a12x2 + . . . + a1nxn
= b1
a21x1 + a22x2 + . . . + a2nxn
= b2
...
= ...
ap1x1 + ap2x2 + . . . + apnxn
= bp
,
R´esoudre le syst`eme (S), c’est trouver tous les n-uplets (x1, . . . , xn) ∈Kn v´eriﬁant (S). Jusqu’`a
la ﬁn du chapitre, on notera (S) (resp. (Sh) l’ensemble des solutions du syst`eme (S) (resp. (Sh)).
Le syst`eme (S) est dit compatible si et seulement si S ̸= ∅. On note qu’un syst`eme homog`ene
est toujours compatible car le n-uplet (0, . . . , 0) est toujours solution d’un syst`eme homog`ene.
5.1.2
Ecriture matricielle d’un syst`eme
Le syst`eme lin´eaire (S) ci-dessus est ´equivalent `a l’expression matricielle
A⃗x = ⃗b ⇐⇒



a11
· · ·
a1n
...
...
...
am1
· · ·
amn


·



x1
...
xn


=



b1
...
bm



46


---

## Page 50

R´esoudre (S), c’est `a dire trouver toutes les ´eventuelles solutions de (S), revient `a r´esoudre
l’´equation matricielle
A⃗x = B
d’inconnue ⃗x =



x1
...
xn


∈Kn ≡M1n(K). Le rang de A est le rang du syst`eme (S). On dit dans
ce cas que le syst`eme est un syst`eme (n, p, r) (n inconnues, p ´equations, de rang r).
Si B ∈Im(A), alors (S) est compatible et si B ∈Im(A), alors (S) n’est pas compatible.
Si de plus A est une matrice carr´ee (syst`emes ayant autant d’´equations que d’inconnues),
le d´eterminant du syst`eme (S) est le d´eterminant de A.
5.1.3
Avec une application lin´eaire
On sait qu’une matrice est canoniquement associ´ee `a une application lin´eaire. En d’autre
termes, puis que la matrice A du syst`eme (S) est un ´el´ement de Mmn(K), on peut consid´erer
que la matrice d’une application lin´eaire f : Kn −→Km par rapport `a leurs bases canonoques.
On appelera alors noyau de la matrice A, le noyau de son endomorphisme associ´e. On le note
ker(A) Soit donc f ∈L(Km, Kn) canoniquement associ´ee `a A. Alors on a
x = (x1, x2, . . . , xn) est solution de (S) ⇐⇒A



x1
...
xp


=



b1
...
bm


⇐⇒f (x) = b
Ainsi,(S) est compatible si et selement si ∃x ∈Km/f (x) = b si et seulement si b ∈Im(A).
5.2
Syst`emes de Cramer
D´eﬁnition 5.2.1 Un syst`eme (n, p, r) est dit de Cramer (on dit aussi cram´erien) si et seule-
ment si n = p = r. Un r´esultat imm´ediat est
Th´eor`eme 5.2.1 Le syst`eme (S) est un syst`eme de Cramer si et seulement si det(S) ̸= 0.
Th´eor`eme 5.2.2 Un syst`eme de Cramer admet une et une seule solution. En particulier, un
syst`eme de Cramer homog`ene admet une et une seule solution `a savoir la solution nulle (0, . .
. , 0).
Preuve: Notons Ala matrice du syst`eme (S). Puisque n = p, A est une matrice carr´ee. Puisque
r = n, A est inversible. Mais alors, pour X ∈Mn,1(K), AX = B ⇐⇒X = A−1B. Ceci montre
l’existence et l’unicit´e de la solution.
□
Dans le th´eor`eme qui suit, on note C1, . . . , Cn, les colonnes de la matrice A.
Th´eor`eme 5.2.3 ( Formules de Cramer) Soit (S) : AX = B un syst`eme de Cramer `a n
´equations. Soit X0 = (xi)1⩽i⩽n ∈Mn,1(K) l’unique solution du syst`eme (S). Alors,
xi = ∆i
∆,
∀i = 1, . . . , n ;
o`u
∆= det(A) = det(C1, ..., Cn)
est le d´eterminant du syst`eme (S) et pour
∆i = det(C1, ..., Ci −1, B, Ci + 1, ..., Cn).
47


---

## Page 51

Preuve: : Admise
□
Exemple 5.2.1 R´esoudre par la m´ethode Cramer le syst`eme :



x + y + z
= 5
x −2y −3z
= −1
2x + y −z
= 3
Solution:
Le syst`eme s’´ecrit
AX = B
avec
A =


1
1
1
1
−2
−3
2
1
−1


On a alors :
∆=

1
1
1
1
−2
−3
2
1
−1

, ∆1 =

5
1
1
−1
−2
−3
3
1
−1

, ∆2 =

1
5
1
1
−1
−3
2
3
−1

, ∆3 =

1
1
5
1
−2
−1
2
1
3

et
∆= 5, ∆1 = 20, ∆2 = −10, ∆3 = 15
S = {(4, −2, 3)}
Exercice 5.2.1 R´esoudre suivant les valeurs du param`etre r´eel m le syst`eme :



2x + 3y + z = 4
−x + my + 2z = 5
7x + 3y + (m −5)z = 7
.
Exemple 5.2.2 R´esoudre dans C3 le syst`eme
(S) :



x + y + z = j2
x + jy + j2z = j
x + j2y + jz = 1
o`u
j = e
2iπ
3
Le d´eterminant du syst`eme (S) est :
∆=

1
1
1
1
j
j2
1
j2
j

= 3(j2 −j) ̸= 0 .
Le syst`eme (S) est un syst`eme de Cramer et admet donc un et un seul triplet solution (x, y, z).
Les formules de Cramer donnent ;
∆x = ∆1 =

j2
1
1
j
j
j2
1
j2
j

= 0 ;
∆y = ∆2 =

1
j2
1
1
j
j2
1
1
j

= 0 ;
∆z = ∆3 =

1
1
j2
1
j
j
1
j2
1

= j2 .
Donc,
S = {(0, 0, j2)}
(ce qui ´etait clair d`es le d´epart).
48


---

## Page 52

5.3
R´esolution d’un syst`eme. Structure de l’ensemble
des solutions
5.3.1
Structure de l’ensemble des solutions
Proposition 5.3.1 Si le syst`eme est homog`ene (bi = 0, ∀∈{1, 2, . . . , m}), alors l’ensemble
des solutions du syst`eme
S = kerA
.
On remarque alors que le syst`eme admet au moins une solution lorsqu’il est homog`ene. i.e. (S0)
est toujours compatible : 0Kn est toujours solution.
Th´eor`eme 5.3.1 Si b ∈Im(f), soit x0 ∈Kn tel que f (x0) = b. Alors l’ensemble des solutions
du syst`eme lin´eaire (S) est
S = x0 + ker f = {x0 + y, y ∈ker f} .
ker f est donn´e par la r´esolution du syst`eme homog`ene (S0) qui correspond `a l’´equation matri-
cielle A⃗x = ⃗0.
D´emonstration :
— Si y ∈ker f, f (x0 + y) = f (x0) = b d’o`u x0 + y ∈S.
— R´eciproquement, si x est solution du syst`eme lin´eaire (S), alors
f (x) = b = f (x0) car x0 est aussi solution .
D’o`u f (x −x0) = 0 ⇔x −x0 ∈ker f et puisque x = x0 + (x −x0), on conclut que
x ∈x0 + ker f.
□
Remarque 5.3.1 Pour r´esoudre le syst`eme (S), il suﬃt de :
▶r´esoudre (S0) i.e trouver ker(A), et de
▶connaˆıtre une solution particuli`ere.
Exemple 5.3.1 D´eterminer l’ensemble solution du syst`eme lin´eaire :
 x + y + z
= 1
−x + 2y + z
= 0
Solution:
ce syst`eme est ´equivalent `a :
 1
1
−1
2
1
 

x
y
z

=
1
0

49


---

## Page 53

On remarque (−1
3, −5
3, 3) est une solution particuli`ere du syst`eme. D´eterminons le noyau de A.
On a :


x
y
z

∈ker(A)
⇐⇒
 x + y + z
= 0
−x + 2y + z
= 0
⇐⇒
 x
= 1
2y
z
= −3
2y
On obtient alors
ker(A) =
1
2y, y, −3
2y

, y ∈R

Ceci nous permet d’´ecrire la solution dy syst`e sou la forme :
S =

−1
3 + 1
2y, −5
3 + y, 3 −3
2y

, y ∈R

Th´eor`eme 5.3.2 D´esignons par r le rang de la matrice A, c’est-`a-dire
r = rg(f) = rgA
qu’on d´eﬁnit comme ´etant le rang du syst`eme (S). On a alors, d’apr`es le th´eor`eme du rang,
dim ker f = p −r
.
▶Si r = p, alors ker f = {0} donc f est injective =⇒(S) admet au plus une solution.
▶Si r < p, alors dim ker f ⩾1 et ker f est inﬁni. Deux cas se pr´esentent :
• si b ∈Im(f), alors (S) admet une inﬁnit´e de solutions
• si b /∈Im(f), (S) est incompatible.
Remarque 5.3.2 Du th´eor`eme pr´ec´edent, on d´eduit alors que le syst`eme lin´eaire (S) admet :
▶Soit aucune solution
▶soit une solution unique
▶soit une inﬁnit´e de solutions.
Comme cons´equence on d´eduit aussi que, si un syst`eme lin´eaire admet au moins 2 solutions,
alors il en admet une inﬁnit´e.
5.4
M´ethodes de r´esolution d’un syst`eme lin´eaire : M´ethode
du pivot de Gauss
La m´ethode du pivot de Gauss consiste, au moyen d’op´erations ´el´ementaires op´erant ex-
clusivement sur les lignes, et au prix d’une ´eventuelle permutation des inconnues, `a transformer
(S) en un syst`eme lin´eaire (S′) ´equivalent, c’est `a dire poss´edant les mˆemes solutions que (S).
La matrice A′ de (S′) est de plus id´ealement du type :
A′ =












m1,1
∗
· · ·
· · ·
· · ·
· · ·
∗
0
m2,2
...
...
...
...
...
...
...
0
· · ·
0
mr,r
∗
· · ·
∗
0
· · ·
· · ·
· · ·
· · ·
· · ·
0
...
...
0
· · ·
· · ·
· · ·
· · ·
· · ·
0












50


---

## Page 54

Avec ∀i ∈{1, . . . , m}, mi,i ̸= 0. On a alors n´ecessairement
r = rg(A′) = rg(A) = rg (S)
.
Le syst`eme A′⃗x = b′ est particuli`erement simple `a r´esoudre, mais on distingue ici plusieurs
cas.
1er cas : r = p ⩽n
(S′) est alors du type :





















m1,1xi + · · · + m1,pxp = β1
...
mp,pxp = βp
0 = βp+1
...
0 = βn
Les ´equations (0 = βi)i∈{1,...,m} sont les ´equations de compatibilit´e de (S). Si ∃j ∈{p+1, . . . , m}
tel que βj ̸= 0, alors (S′) et (S) sont incompatibles.
Si ∀i ∈{p + 1, . . . , m}, β = 0, alors les ´equations de compatibilit´e peuvent ˆetre retir´ees du
syst`eme car toujours vraies et le syst`eme restant se r´esout ais´ement en ≪remontant ≫.
2e cas : r = n ⩽m
(S′) est alors du type :





m1,1xi + · · · + m1,nxn + · · · + m1,pxp = β1
...
m1,nxn + · · · + mp,pxp = βp
On appelle alors x1, x2, . . . , xp les inconnues principales et xn+1, xn+2, . . . , xm les inconnues
secondaires. On pose ∀i ∈{n+1, . . . , m}, xi = λi pour marquer le fait qu’on prend les inconnues
secondaires pour param`etres et on r´esout par rapport `a x1, x2, . . . , xp. On a toujours d`es que
p > n une inﬁnit´e de solution.
Exemple
Prenons n = 2, p = 4,
(S) :
(
x + y −z + t = 1
y + z −t = 2
On prend z et t pour param`etres. Ainsi,
(x, y, z, t) ∈S
⇔
(
x + y = 1 + z −t
y = 2 + t −z
⇔
(
x = −1 + 2 (z −t)
y = 2 + t −z
On a donc S
=
{(−1 + 2 (z −t) , 2 + t −z, z, t) , z, t ∈R}
=
{(−1, 2, 0, 0) + z (2, −1, 0, 0) + t (−2, 1, 0, 1) z, t ∈R}
=
(−1, 2, 0, 0) + vect {(−2, 1, 1, 0) , (−2, 1, 0, 1)}
51


---

## Page 55

3e cas : r = p = n
On a alors tout de suite, d’apr`es la forme de A′, A′ est inversible donc
A′⃗x = b′ ⇔⃗x = A′−1b′
(S) a donc une unique solution, on parle de syst`eme de Cramer. La r´esolution de ce syst`eme
triangulaire 1 est imm´ediate.
4e cas : en g´en´eral, r < min (n, p)
S′ est du type





















m1,1xi + · · · + m1,nxn + · · · + m1,pxp = β1
...
m1,nxn + · · · + mp,pxp = βp
0 = βp+1
...
0 = βn
Pour i ∈{r + 1, . . . , m}, 0 = βi est une ´equation de compatibilit´e de (S′), et donc de (S).
Si les conditions de compatibilit´e sont v´eriﬁ´ees, on est ramen´e au deuxi`eme cas avec r `a la
place de m.
5.5
TD sur les syst`emes lin´eaires
Exercice 5.5.1 R´esoudre les syst`emes suivants



3x
−y
+2z
=
a
−x
+2y
−3z
=
b
x
+2y
+ z
=
c



x
+y
+2z
=
5
x
−y
−z
=
1
x
+ z
=
3
Exercice 5.5.2 Sans chercher `a r´esoudre les systˆemes suivants, discuter la nature de leurs
ensembles de solution :



x
+y
−z
=
0
x
−y
=
0
x
+y
+z
=
0



x
+3y
+2z
=
1
2x
−2y
=
2
x
+ y
+ z
=
2



x
+3y
+2z
=
1
2x
−2y
=
2
x
+ y
+ z
=
3
Exercice 5.5.3 Soient x0,x1,...,xn, n + 1 r´eels distincts, et y0,y1,...,yn, n + 1 r´eels (distincts
ou non).
Montrer qu’il existe un unique polynˆome P tel que :
∀i ∈{0, ..., n}
P(xi) = yi
Exercice 5.5.4 R´esoudre, suivant les valeurs de m :
(S1)

x + (m + 1)y
=
m + 2
mx + (m + 4)y
=
3
(S2)
 mx + (m −1)y
=
m + 2
(m + 1)x −my
=
5m + 3
1. On remarque que dans ce cas, la matrice A′ est aussi triangulaire sup´erieure.
52


---

## Page 56

Exercice 5.5.5 R´esoudre et discuter suivant les valeurs de b1, b2, b3 et b4 :
(S1)







x + 3y + 4z + 7t
=
b1
x + 3y + 4z + 5t
=
b2
x + 3y + 3z + 2t
=
b3
x + y + z + t
=
b4
(S2)







x + 3y + 5z + 3t
=
b1
x + 4y + 7z + 3t
=
b2
y + 2z
=
b3
x + 2y + 3z + 2t
=
b4
(S3)







x + y + 2z −t
=
b1
−x + 3y + t
=
b2
2x −2y + 2z −2t
=
b3
2y + z
=
b4
(S4)







x + 2y + z + 2t
=
b1
−2x −4y −2z −4t
=
b2
−x −2y −z −2t
=
b3
3x + 6y + 3z + 6t
=
b4
Exercice 5.5.6 Discuter et r´esoudre suivant les valeurs des r´eels λ, a, b, c, d :
(S)







(1 + λ)x + y + z + t
=
a
x + (1 + λ)y + z + t
=
b
x + y + (1 + λ)z + t
=
c
x + y + z + (1 + λ)t
=
d
Exercice 5.5.7 Discuter et r´esoudre suivant les valeurs des r´eels λ et a :
(S)











3x + 2y −z + t
=
λ
2x + y −z
=
λ −1
5x + 4y −2z
=
2λ
(λ + 2)x + (λ + 2)y −z
=
3λ + a
3x −z + 3t
=
−λ2
Exercice 5.5.8 Mettre sous forme matricielle et r´esoudre les syst`emes suivants.
1.







2x + y + z
=
3
3x −y −2z
=
0
x + y −z
=
−2
x + 2y + z
=
1
2.











x + y + z + t
=
1
x −y + 2z −3t
=
2
2x + 4z + 4t
=
3
2x + 2y + 3z + 8t
=
2
5x + 3y + 9z + 19t
=
6
3.







2x + y + z + t
=
1
x + 2y + 3z + 4t
=
2
3x −y −3z + 2t
=
5
5y + 9z −t
=
−6
4.



x −y + z + t
=
5
2x + 3y + 4z + 5t
=
8
3x + y −z + t
=
7
5.



x + 2y + 3z
=
0
2x + 3y −z
=
0
3x + y + 2z
=
0
Exercice 5.5.9 Calculer les d´eterminants suivants.
D1 =

1
3
2
1
3
3
1
2
1

, D2 =

1
1
1
3
3
2
2
3
1

, D3 =

5
−3
13
0
−1
−16
0
0
2

D4 =

1
0
0
0
√
3
2
−1
2
0
1
2
√
3
2

D5 =

0
0
1
1
0
0
0
1
0

Exercice 5.5.10 R´esoudre et discuter le syst`eme lin´eaire suivant :
(S)







x1 + x2 + 3x3 + 10x4 + x5
=
b1
x1 + 2x2 + x3 + 4x4 + 7x5
=
b2
x1 + 3x2 + 4x3 + 13x4 + 8x5
=
b3
x1 + 4x2 + 2x3 + 7x4 + 14x5
=
b4
53


---

## Page 57

Exercice 5.5.11 On consid`ere l’application f de R5 dans R4 qui `a un ´el´ement X = (x1, x2, x3, x4, x5)
associe l’´el´ement Y = (y1, y2, y3, y4), d´eﬁni par :
(S)







x1 + x2 + 3x3 + 10x4 + x5
=
y1
x1 + 2x2 + x3 + 4x4 + 7x5
=
y2
x1 + 3x2 + 4x3 + 13x4 + 8x5
=
y3
x1 + 4x2 + 2x3 + 7x4 + 14x5
=
y4
1. Montrer que f est lin´eaire.
2. On consid`ere A l’ensemble des solutions de (SH).
(SH)







x1 + x2 + 3x3 + 10x4 + x5
=
0
x1 + 2x2 + x3 + 4x4 + 7x5
=
0
x1 + 3x2 + 4x3 + 13x4 + 8x5
=
0
x1 + 4x2 + 2x3 + 7x4 + 14x5
=
0
Quelle est la nature de A ? Que repr´esente A pour l’application f ? Donner une base
de A ; quelle est la dimension de A ? Donner un syst`eme minimal d’´equations qui
d´eﬁnissent A.
3. Dans l’espace R4, on consid`ere les cinq vecteurs : V1 = (1, 1, 1, 1), V2 = (1, 2, 3, 4),
V3 = (3, 1, 4, 2), V4 = (10, 4, 13, 7), V5 = (1, 7, 8, 14). Que repr´esentent ces vecteurs pour
l’application f ? Trouver une base de Imf.
4. On consid`ere le syst`eme (S) o`u les inconnues sont les xi, et o`u les yj sont des param`etres.
Comment interpr´eter les conditions de possibilit´e de ce syst`eme du point de vue de f ?
5. Donner une interpr´etation du th´eor`eme du rang relativement `a ce syst`eme. Quel est le
lien entre le rang de f et le rang du syst`eme ?
Exercice 5.5.12 Pour tout a r´eel, on consid`ere la matrice A et le syst`eme lin´eaire (S) d´eﬁnis
par :
A =




a
1
1
1
1
a
1
1
1
1
a
1
1
1
1
a




(S)







ax
+
y
+
z
+
t
=
1
x
+
ay
+
z
+
t
=
1
x
+
y
+
az
+
t
=
1
x
+
y
+
z
+
at
=
1
aux inconnues r´eelles x, y, z, t.
1. Discuter le rang de A suivant les valeurs de a.
2. Pour quelles valeurs de a le syst`eme (S) est-il de Cramer ? Compatible ? Incompatible ?
3. Lorsqu’il est de Cramer, r´esoudre (S) avec un minimum d’op´erations (on pourra montrer
d’abord que l’on a n´ecessairement x = y = z = t.).
4. Retrouver 3. par application des formules de Cramer.
Exercice 5.5.13 D´eterminer le noyau de la matrice


1
−1
1
0
1
1
2
3
7


Exercice 5.5.14 Soit A =


2
2
0
1
2
1
0
2
2

. D´eterminer les λ ∈R tels que ∃X ∈R3 −{(0, 0, 0)}
tel que AX = λX. Pour chaque λ d´eterminer Eλ = {X ∈R3/AX = λX}.
54


---

## Page 58

Exercice 5.5.15 Donner une base de l’ensemble des solutions de









3x + 2z = 0
3y + z + 3t = 0
x + y + z + t = 0
2x −y + z −t = 0
.
Exercice 5.5.16 R´esoudre suivant les valeurs de a ∈R





x + ay + a2z = 0
a2x + y + az = 0
ax + a2y + z = 0
.
Exercice 5.5.17 R´esoudre suivant les valeurs de a et µ ∈R









ax + y + z + t = 1
x + ay + z + t = µ
x + y + az + t = µ2
x + y + z + at = µ3
.
Exercice 5.5.18 Inverser en utilisant un syst`eme lin´eaire la matrice


1
1
1
2
1
1
1
2
1

.
Exercice 5.5.19 Soit F le sous-espace vectoriel de R4 des ´el´ements (x, y, z, t) qui satisfont :



x + y + z + 3t
=
0
2x + 3y + 4t
=
0
2x + 5y −4z
=
0
Donner une base de F et sa dimension.
Exercice 5.5.20 On consid`ere le syst`eme
(S) :



x + y + z + t
= 0
x −y −2z + 2t
= 0
2x + y + z
= 0
1. R´esoudre le syst`eme (S) puis indiquer son rang.
2. Montrer que l’ensemble des solutions de (S) est un sous-espace vectoriel de R4, indiquer
sa dimension et en donner une base.
55
