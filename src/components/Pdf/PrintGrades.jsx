import { forwardRef } from "react";

const PrintGrades = forwardRef(({ students, subject }, ref) => {
  return (
    <div className="w-full min-w-full px-5 py-4" ref={ref}>
      <h1 className="font-serif font-bold text-black text-2xl">
        {subject.name} - {subject.grade}
        {subject.group}
      </h1>
      <br />
      <table className="table-auto w-full">
        <thead className="h-[50px] bg-[#f8f9fb] font-serif font-semibold">
          <tr>
            <th className="text-start px-2 min-w-[250px] border-[1px] border-gray-300">
              Estudiante
            </th>
            <th className="border-[1px] border-gray-300">
              <div className="grid grid-cols-2 grid-rows-2 center">
                <p className="col-span-2 text-lg border-b-[1px] flex justify-center items-center">
                  Evaluación 1
                </p>
                <p className="border-r-[1px] flex justify-center items-center">Calificación</p>
                <p className="flex justify-center items-center">Asistencia total</p>
              </div>
            </th>
            <th className="border-[1px] border-gray-300">
              <div className="grid grid-cols-2 grid-rows-2 center">
                <p className="col-span-2 text-lg border-b-[1px] flex justify-center items-center">
                  Evaluación 2
                </p>
                <p className="border-r-[1px] flex justify-center items-center">Calificación</p>
                <p className="flex justify-center items-center">Asistencia total</p>
              </div>
            </th>
            <th className="border-[1px] border-gray-300">
              <div className="grid grid-cols-2 grid-rows-2 center">
                <p className="col-span-2 text-lg border-b-[1px] flex justify-center items-center">
                  Evaluación 3
                </p>
                <p className="border-r-[1px] flex justify-center items-center">Calificación</p>
                <p className="flex justify-center items-center">Asistencia total</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={index}
              className="border-[1px] border-gray-300 h-[60px]"
            >
              <td className="p-2 border-x-[1px] border-gray-300">{`${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`}</td>
              {student.grades?.map((grade, i) => (
                <td className="p-2 text-center border-x-[1px] border-gray-300" key={i}>
                  <div className="grid grid-cols-2 divide-x">
                    <p>{grade.grade}</p>
                    <p>{grade.assist_total}</p>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintGrades;
