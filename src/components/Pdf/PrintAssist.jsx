import { forwardRef } from "react";

const PrintAssist = forwardRef(({ students, subject }, ref) => {
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
            <th className="text-start px-2 min-w-[250px] border-[1px] border-gray-300">Estudiante</th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
            <th className="p-2 border-[1px] border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="border-[1px] border-gray-300 h-[60px]">
              <td className="p-2">{`${student.firstname} ${student.lastnamepaternal} ${student.lastnamematernal}`}</td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
              <td className="border-[1px] border-gray-300"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
})

export default PrintAssist;
