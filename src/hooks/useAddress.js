import { useEffect, useState } from "react";
import { getAddressesRequest } from "../api/address";
import toast from "react-hot-toast";

export function useAddress({ setValue } = {}) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [fatherSuggestions, setFatherSuggestions] = useState([]);
  const [motherSuggestions, setMotherSuggestions] = useState([]);
  const [tutorSuggestions, setTutorSuggestions] = useState([]);
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const fieldMap = {
    father: {
      colony: "father_colony",
      postalcode: "father_postalcode",
      addressid: "father_addressid",
      suggestions: setFatherSuggestions,
    },
    mother: {
      colony: "mother_colony",
      postalcode: "mother_postalcode",
      addressid: "mother_addressid",
      suggestions: setMotherSuggestions,
    },
    tutor: {
      colony: "tutor_colony",
      postalcode: "tutor_postalcode",
      addressid: "tutor_addressid",
      suggestions: setTutorSuggestions,
    },
    student: {
      colony: "student_colony",
      postalcode: "student_postalcode",
      addressid: "student_addressid",
      suggestions: setStudentSuggestions,
    },
    normal: {
      colony: "colony",
      postalcode: "postalcode",
      addressid: "addressid",
      suggestions: setSuggestions,
    }
  };

  const getAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddressesRequest()
      setAddresses(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener los direcciones");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCP = (e, type = "normal") => {
    const postalcode = e.target.value.replace(/[^0-9]/g, "");
    const fieldInfo = fieldMap[type];
    setValue(fieldInfo.postalcode, postalcode);
    if (postalcode.length === 5) {
      const matchingAddresses = addresses.filter((address) =>
        address.CP.includes(postalcode)
      );
      fieldInfo.suggestions(matchingAddresses);
    }
  };

  const handleSelectAddress = (address, type = "normal") => {
    const fieldInfo = fieldMap[type];
    setValue(fieldInfo.colony, address.asentamiento);
    setValue(fieldInfo.postalcode, address.CP);
    setValue(fieldInfo.addressid, address.id);
    fieldInfo.suggestions([]);
  };

  useEffect(() => {
    getAddresses();
  }, []);

  return {
    addresses,
    loading,
    suggestions,
    selectedAddress,
    getAddresses,
    handleChangeCP,
    handleSelectAddress,
    fatherSuggestions,
    motherSuggestions,
    tutorSuggestions,
    studentSuggestions,
  };
}
