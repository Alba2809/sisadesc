import { useState } from "react";
import { groupArray } from "../utils/functions";

export function useGroupTable() {
  const [allObjects, setAllObjects] = useState([]);
  const [objects, setObjects] = useState([]);
  const [groupSize, setGroupsSize] = useState(5);
  const [groupIndex, setGroupIndex] = useState(0);
  const [filterStatus, setFilterStatus] = useState("Activo");

  const groupObjects = (groupSize, filterStatus) => {
    return setObjects(
      groupArray(
        allObjects.filter((object) =>
          filterStatus === "Ambos" ? true : object.status === filterStatus
        ),
        groupSize
      )
    );
  };
  const handleOptionGroup = (value) => {
    setGroupsSize(+value);
    setGroupIndex(0);
    groupObjects(+value, filterStatus);
  };

  const handleOptionStatus = (status) => {
    setFilterStatus(status);
    groupObjects(groupSize, status);
  };

  const handleNext = () => {
    setGroupIndex((prevIndex) => Math.min(prevIndex + 1, objects.length - 1));
  };

  const handleBack = () => {
    setGroupIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const startRecord = groupIndex * groupSize + 1;

  const endRecord = Math.min((groupIndex + 1) * groupSize, allObjects.length);

  const totalRecords = allObjects.length;

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (e.target.value === "") return groupObjects(groupSize, filterStatus);

      const filteredObjects = allObjects.filter((user) =>
        Object.entries(user).some(
          ([key, value]) =>
            key !== "id" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            (typeof value === "string" || typeof value === "number") &&
            value
              .toString()
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
        )
      );

      setObjects(
        groupArray(
          filteredObjects.filter((object) =>
            filterStatus === "Ambos" ? true : object.status === filterStatus
          ),
          groupSize
        )
      );
    }
  };

  const setData = (data) => {
    setAllObjects(data);
    setObjects(
      groupArray(
        data.filter((object) =>
          filterStatus === "Ambos" ? true : object.status === filterStatus
        ),
        groupSize
      )
    );
  };

  const setDataWithoutFilter = (data) => {
    setAllObjects(data);
    setObjects(groupArray(data, groupSize));
    setFilterStatus("Ambos");
  };

  return {
    allObjects,
    setAllObjects,
    setData,
    setDataWithoutFilter,
    objects,
    groupSize,
    groupIndex,
    handleOptionGroup,
    filterStatus,
    handleOptionStatus,
    handleNext,
    handleBack,
    startRecord,
    endRecord,
    totalRecords,
    handleSearch,
    setFilterStatus,
  };
}
