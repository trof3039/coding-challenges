// https://www.codewars.com/kata/5935558a32fb828aad001213

// Shortest solution
f=
''
[
'\
t\
r\
i\
m'
][
'\
b\
i\
n\
d\
']
`\
H\
e\
l\
l\
o\
,\
 \
w\
o\
r\
l\
d\
!`

// Easiest solution
g=
0[
c=
'\
c\
o\
n\
s\
t\
r\
u\
c\
t\
o\
r\
']
[c
]
`\
r\
e\
t\
u\
r\
n\
 \
'\
H\
e\
l\
l\
o\
,\
 \
w\
o\
r\
l\
d\
!\
'`

// One more solution
0[
c=
'\
c\
o\
n\
s\
t\
r\
u\
c\
t\
o\
r\
']
[c
]
`\
h=
_\
=>
'\
H\
e\
l\
l\
o\
,\
 \
w\
o\
r\
l\
d\
!\
'`
()



console.log(f())
console.log(g())
console.log(h())

const f2 = ''['trim']['bind']('Hello, world!')
const f3 = ''['trim']['bind']`Hello, world!`

console.log(f2())
console.log(f3())
console.log(Function('t=_=>true'))
