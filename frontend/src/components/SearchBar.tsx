// "use client";
// import { useState } from "react";
// import { Input, InputGroup, Button, Box } from "@chakra-ui/react";
// import { LuSearch } from "react-icons/lu";
// import { useRouter, useSearchParams } from "next/navigation";

// export const SearchBar = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const initialQuery = searchParams.get("search") || "";
//   const [query, setQuery] = useState<string>(initialQuery);

//   const handleSearch = () => {
//     if (query.trim()) {
//       // Update URL with search query
//       const params = new URLSearchParams(searchParams.toString());
//       params.set("search", query.trim());
//       router.push(`/shop?${params.toString()}`);
//     } else {
//       // If query is empty, remove search param
//       const params = new URLSearchParams(searchParams.toString());
//       params.delete("search");
//       router.push(`/shop?${params.toString()}`);
//     }
//   };

//   return (
//     <Box
//       px={{ base: 4, md: 4, lg: 0 }}
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       w="100%"
//     >
//       <InputGroup
//         bg="white"
//         width={{ base: "100%", md: "90%", lg: "600px" }}
//         h="3rem"
//         borderRadius="full"
//         mx="auto"
//         startElement={<LuSearch className="ml-3 text-gray-500" size={20} />}
//         endElement={
//           <Button
//             bg="var(--searchButtonBg)"
//             color="white"
//             borderRadius="full"
//             px="4"
//             py="1"
//             mr={1}
//             cursor="pointer"
//             style={{ height: "80%" }}
//             _hover={{ bg: "var(--searchButtonBg)" }}
//             _focus={{ outline: "none" }}
//             _focusVisible={{ outline: "none", boxShadow: "none" }}
//             onClick={handleSearch}
//           >
//             Search
//           </Button>
//         }
//       >
//         <Input
//           placeholder="Search for products"
//           borderRadius="full"
//           border="none"
//           pl={["2.5rem", null, "3rem"]}
//           pr={["5rem", null, "6rem"]}
//           _focus={{ outline: "none", boxShadow: "none" }}
//           _focusVisible={{ outline: "none", boxShadow: "none" }}
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//         />
//       </InputGroup>
//     </Box>
//   );
// };

"use client";
import { useState, useEffect } from "react";
import { Input, InputGroup, Button, Box } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  const [query, setQuery] = useState<string>(initialQuery);

  // Sync with URL changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    
    // Preserve other query parameters
    // router.push(`${pathname}?${params.toString()}`);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Box
      px={{ base: 4, md: 4, lg: 0 }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="100%"
    >
      <InputGroup
        bg="white"
        width={{ base: "100%", md: "90%", lg: "600px" }}
        h="3rem"
        borderRadius="full"
        mx="auto"
        startElement={<LuSearch className="ml-3 text-gray-500" size={20} />}
        endElement={
          <Button
            bg="var(--searchButtonBg)"
            color="white"
            borderRadius="full"
            px="4"
            py="1"
            mr={1}
            cursor="pointer"
            style={{ height: "80%" }}
            _hover={{ bg: "var(--searchButtonBg)" }}
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
            onClick={handleSearch}
          >
            Search
          </Button>
        }
      >
        <Input
          placeholder="Search for products"
          borderRadius="full"
          border="none"
          pl={["2.5rem", null, "3rem"]}
          pr={["5rem", null, "6rem"]}
          _focus={{ outline: "none", boxShadow: "none" }}
          _focusVisible={{ outline: "none", boxShadow: "none" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </InputGroup>
    </Box>
  );
};