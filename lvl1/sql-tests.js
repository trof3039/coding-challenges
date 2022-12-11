// 'GROUP BY tests'
const query = require('./sql.js')

// // GROUP BY tests

var persons = [
  {name: 'Peter', profession: 'teacher', age: 20, maritalStatus: 'married'},
  {name: 'Michael', profession: 'teacher', age: 50, maritalStatus: 'single'},
  {name: 'Peter', profession: 'teacher', age: 20, maritalStatus: 'married'},
  {name: 'Anna', profession: 'scientific', age: 20, maritalStatus: 'married'},
  {name: 'Rose', profession: 'scientific', age: 50, maritalStatus: 'married'},
  {name: 'Anna', profession: 'scientific', age: 20, maritalStatus: 'single'},
  {name: 'Anna', profession: 'politician', age: 50, maritalStatus: 'married'}
];

function profession(person) {
  return person.profession;
}
// //SELECT * FROM persons GROUPBY profession <- Bad in SQL but possible in JavaScript
// // 1
console.log(JSON.stringify(query().select().from(persons).groupBy(profession).execute())); 
console.log(JSON.stringify([["teacher",[{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"},{"name":"Michael","profession":"teacher","age":50,"maritalStatus":"single"},{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"}]],["scientific",[{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"married"},{"name":"Rose","profession":"scientific","age":50,"maritalStatus":"married"},{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"single"}]],["politician",[{"name":"Anna","profession":"politician","age":50,"maritalStatus":"married"}]]]))

function isTeacher(person) {
    return person.profession === 'teacher';
}

//SELECT * FROM persons WHERE profession='teacher' GROUPBY profession
// 2
console.log(JSON.stringify(query().select().from(persons).where(isTeacher).groupBy(profession).execute())); 
console.log(JSON.stringify([["teacher",[{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"},{"name":"Michael","profession":"teacher","age":50,"maritalStatus":"single"},{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"}]]]))

function professionGroup(group) {
    return group[0];
}

//SELECT profession FROM persons GROUPBY profession
// 3
console.log(JSON.stringify(query().select(professionGroup).from(persons).groupBy(profession).execute()));
console.log(JSON.stringify(["teacher","scientific","politician"]));


function name(person) {
    return person.name;
}

//SELECT * FROM persons WHERE profession='teacher' GROUPBY profession, name
// 4
console.log(JSON.stringify(query().select().from(persons).groupBy(profession, name).execute()));
console.log(JSON.stringify([["teacher",[["Peter",[{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"},{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"}]],["Michael",[{"name":"Michael","profession":"teacher","age":50,"maritalStatus":"single"}]]]],["scientific",[["Anna",[{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"married"},{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"single"}]],["Rose",[{"name":"Rose","profession":"scientific","age":50,"maritalStatus":"married"}]]]],["politician",[["Anna",[{"name":"Anna","profession":"politician","age":50,"maritalStatus":"married"}]]]]]));

function age(person) {
    return person.age;
}

function maritalStatus(person) {
    return person.maritalStatus;
}

//SELECT * FROM persons WHERE profession='teacher' GROUPBY profession, name, age
// 5
console.log(JSON.stringify(query().select().from(persons).groupBy(profession, name, age, maritalStatus).execute()));
console.log(JSON.stringify([["teacher",[["Peter",[[20,[["married",[{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"},{"name":"Peter","profession":"teacher","age":20,"maritalStatus":"married"}]]]]]],["Michael",[[50,[["single",[{"name":"Michael","profession":"teacher","age":50,"maritalStatus":"single"}]]]]]]]],["scientific",[["Anna",[[20,[["married",[{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"married"}]],["single",[{"name":"Anna","profession":"scientific","age":20,"maritalStatus":"single"}]]]]]],["Rose",[[50,[["married",[{"name":"Rose","profession":"scientific","age":50,"maritalStatus":"married"}]]]]]]]],["politician",[["Anna",[[50,[["married",[{"name":"Anna","profession":"politician","age":50,"maritalStatus":"married"}]]]]]]]]]));

function professionCount(group) {
    return [group[0], group[1].length];
}

// //SELECT profession, count(profession) FROM persons GROUPBY profession
// // 6
console.log(JSON.stringify(query().select(professionCount).from(persons).groupBy(profession).execute()));
console.log(JSON.stringify([["teacher",3],["scientific",3],["politician",1]]));

function naturalCompare(value1, value2) {
    if (value1 < value2) {
    return -1;
    } else if (value1 > value2) {
    return 1;
    } else {
    return 0;
    }
}

//SELECT profession, count(profession) FROM persons GROUPBY profession ORDER BY profession
// 7
console.log(JSON.stringify(query().select(professionCount).from(persons).groupBy(profession).orderBy(naturalCompare).execute()));
console.log(JSON.stringify([["politician",1],["scientific",3],["teacher",3]]));

// join tests

// var teachers = [
//     {
//       teacherId: '1',
//       teacherName: 'Peter'
//     },
//     {
//       teacherId: '2',
//       teacherName: 'Anna'
//     }
//   ];
  
  
//   var students = [
//     {
//       studentName: 'Michael',
//       tutor: '1'
//     },
//     {
//       studentName: 'Rose',
//       tutor: '2'
//     }
//   ];
  
//   function teacherJoin(join) {
//     return join[0].teacherId === join[1].tutor;
//   }
  
//   function student(join) {
//     return {studentName: join[1].studentName, teacherName: join[0].teacherName};
//   }
  
//   //SELECT studentName, teacherName FROM teachers, students WHERE teachers.teacherId = students.tutor
//   console.log(JSON.stringify(query().select(student).from(teachers, students).where(teacherJoin).execute()))
//   console.log(JSON.stringify([{"studentName":"Michael","teacherName":"Peter"},{"studentName":"Rose","teacherName":"Anna"}]))
  
//   var numbers1 = [1, 2];
//   var numbers2 = [4, 5];

//   console.log(JSON.stringify(query().select().from(numbers1, numbers2).execute()))
//   console.log(JSON.stringify([[1,4],[1,5],[2,4],[2,5]]))

//   function tutor1(join) {
//     return join[1].tutor === "1";
//   }
  
//   //SELECT studentName, teacherName FROM teachers, students WHERE teachers.teacherId = students.tutor AND tutor = 1 
//   console.log(JSON.stringify(query().select(student).from(teachers, students).where(teacherJoin).where(tutor1).execute()))
//   console.log(JSON.stringify([{"studentName":"Michael","teacherName":"Peter"}]))


// Other tests: 

// const persons = [
//     {name: 'Peter', profession: 'teacher', age: 20, maritalStatus: 'married'},
//     {name: 'Michael', profession: 'teacher', age: 50, maritalStatus: 'single'},
//     {name: 'Peter', profession: 'teacher', age: 20, maritalStatus: 'married'},
//     {name: 'Anna', profession: 'scientific', age: 20, maritalStatus: 'married'},
//     {name: 'Rose', profession: 'scientific', age: 50, maritalStatus: 'married'},
//     {name: 'Anna', profession: 'scientific', age: 20, maritalStatus: 'single'},
//     {name: 'Anna', profession: 'politician', age: 50, maritalStatus: 'married'}
// ];
// console.log(query().select().from(persons).execute())



// function profession(person) {
//     return person.profession;
// }
// console.log(query().select(profession).from(persons).execute())



// var numbers = [1, 2, 1, 3, 5, 6, 1, 2, 5, 6];
// function greatThan1(group) {
//   return group[1].length > 1;
// }
// function isPair(group) {
//   return group[0] % 2 === 0;
// }
// function id(value) {
//   return value;
// }
// function frequency(group) {
//   return { value: group[0], frequency: group[1].length };      
// }
// console.log(query().select(frequency).from(numbers).groupBy(id).having(greatThan1).having(isPair).execute())



// var numbers = [1, 2, 3, 4, 5, 7];
// function lessThan3(number) {
//   return number < 3;
// }
// function greaterThan4(number) {
//   return number > 4;
// }
// console.log(query().select().from(numbers).where(lessThan3, greaterThan4).execute())



// var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]; 
// function isPrime(number) {
//     if (number < 2) {
//       return false;
//     }
//     var divisor = 2;
//     for(; number % divisor !== 0; divisor++);
//     return divisor === number;
// }
// function prime(number) {
//     return isPrime(number) ? 'prime' : 'divisible';
// }
// function odd(group) {
//     return group[0] === 'odd';
// }
// function isEven(number) {
//     return number % 2 === 0;
// }
// function parity(number) {
//     return isEven(number) ? 'even' : 'odd';
// }
// console.log(query().select().from(numbers).groupBy(parity).having(odd).execute())
// console.log(JSON.stringify(query().select().from(numbers).groupBy(parity, prime).execute()))
// console.log(JSON.stringify((query().select().from(numbers).execute(), numbers)))
// console.log(JSON.stringify((query().select().execute(), [], 'No FROM clause produces empty array')))
// console.log(JSON.stringify((query().from(numbers).execute(), numbers, 'SELECT can be omited')))
// console.log(JSON.stringify((query().execute(), [])))
// console.log(JSON.stringify((query().from(numbers).select().execute(), numbers, 'The order does not matter')))
