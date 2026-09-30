let students = [
    {id: 101, name:"Ana", grade: 95},
    {id: 102, name:"Ben", grade: 78},
    {id: 103, name:"Willems", grade: 96},
    {id: 104, name:"Alexis", grade: 90},
    {id: 105, name:"Alice", grade: 84},
    {id: 106, name:"David", grade: 92},
    {id: 107, name:"Bob", grade: 75},
    {id: 108, name:"Carl", grade: 88},
    {id: 109, name:"Diana", grade: 95},
    {id: 110, name:"Eva", grade: 67},
    {id: 111, name:"Frank", grade: 79},
    {id: 112, name:"Annie", grade: 98},
    {id: 113, name:"Mark", grade: 83},
    {id: 114, name:"Mateo", grade: 74},
    {id: 115, name:"Angela", grade: 91},
    {id: 116, name:"Lucas", grade: 85},
    {id: 117, name:"Sophia", grade: 72},
    {id: 118, name:"Gabriel", grade: 90},
    {id: 119, name:"Chloe", grade: 81},
    {id: 120, name:"Liam", grade: 77},
    {id: 121, name:"Zoe", grade: 96}
];

//Part 1 - forEach()
console.log(`\n--------------- PART I ---------------\n`);
students.forEach(student => {
    console.log(`ID: ${student.id} \nName: ${student.name} \nGrade: ${student.grade}\n\n-----------------\n`);
});

//Part 2 - map()
let updatedGrades = students.map(student => ({
    ...student, grade: student.grade + 5
}));
console.log(`\n--------------- PART II ---------------\nUpdated Grades: `, updatedGrades);

//Part 3 - filter()
let passingStudents = students.filter(student => student.grade >= 75);
console.log(`\n--------------- PART III ---------------\nPassing Students: `, passingStudents);

//Part 4 - find()
let honorStudent = students.find(student => student.grade >= 90);
console.log(`\n--------------- PART IV ---------------\nHonor Student: `, honorStudent);

//Part 5 - findIndex()
let searchStudent = ["Carl", "Angela", "Ben"];
console.log(`\n--------------- PART V ---------------`);
searchStudent.forEach(name => {
    let indexOfStudent = students.findIndex(student => student.name === name);
    console.log(`\nIndex of ${name}: `, indexOfStudent);
});

//Part 6 - concat()
let newStudents = [
    {id: 122, name:"Faith", grade: 88},
    {id: 123, name:"George", grade: 82}
];
let newListOfStudents = students.concat(newStudents);
console.log(`\n--------------- PART VI ---------------\nUpdated List of Students: `, newListOfStudents);

//Part 7 - slice()
let selectedStudents = students.slice(1, 4);
console.log(`\n--------------- PART VII ---------------\nSelected Students: `, selectedStudents);

//Part 8 - fill()
let attendance = ["Present", "Present", "Absent", "Late", "Present"];
attendance.fill("Present", 3, 5);
console.log(`\n--------------- PART VIII ---------------\nAttendance Reset: `, attendance);

//Part 9 - copyWithin()
let seats = ["A", "B", "C", "D", "E"];
seats.copyWithin(0, 3);
console.log(`\n--------------- PART IX ---------------\nSeat Rearrangement: `, seats);

//Part 10 - flat() and flatMap()
let courses = [
    ["HTML", "CSS"],
    ["JavaScript", "PHP"],
    ["Flutter", "Firebase"]
];

let allFlatCourses = courses.flat();
console.log(`\n--------------- PART X ---------------\nAll Courses: `, allFlatCourses);

let allFlatMapCourses = courses.flatMap(course => course.map(c => c.toUpperCase()));
console.log("All Uppercase Courses: ", allFlatMapCourses);