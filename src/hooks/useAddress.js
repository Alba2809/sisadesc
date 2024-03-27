import { useEffect, useState } from "react";
import { getAddressesRequest } from "../api/address";
import toast from "react-hot-toast";

export function useAddress({ setValue } = {}) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

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

  const handleChangeCP = (e) => {
    const postalcode = e.target.value.replace(/[^0-9]/g, "");
    setValue("postalcode", postalcode);
    if (postalcode.length === 5) {
      const matchingAddresses = addresses.filter((address) =>
        address.CP.includes(postalcode)
      );
      setSuggestions(matchingAddresses);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setValue("colony", address.asentamiento);
    setValue("postalcode", address.CP);
    setValue("addressid", address.id);
    setSuggestions([]);
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
  };
}
