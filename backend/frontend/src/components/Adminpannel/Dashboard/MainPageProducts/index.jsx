import { useState, useContext, useEffect } from "react";
import "./index.css";
import noDataImage from "../../../../assets/nodata.jpg";
import CategoryContext from "../Product/details";
import axiosClient from "../../../../apisSetup/axiosClient";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import "react-toastify/dist/ReactToastify.css";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TableContainer from "@mui/material/TableContainer";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { ToastContainer, toast } from "react-toastify";
import { useRequestProcessor } from "../../../../apisSetup/requestProcessor";
import { useQuery, useMutation } from "react-query";

export default function MainPageProductsSettings() {
  const [productData, setProductData] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="delivery-price-container">
      <div className="display-flex justify-sb">
        <h1 className="custom-heading">Add Products to Main Page</h1>
        <button
          className="custom-button hr-mr-3"
          onClick={() => setShowAddProduct(!showAddProduct)}
        >
          {" "}
          Add Products
        </button>
      </div>

      {showAddProduct && (
        <EntryForm closeContainer={() => setShowAddProduct(false)} />
      )}
      <DisplayCard />
    </div>
  );
}

function EntryForm({ closeContainer }) {
  const { categoryList } = useContext(CategoryContext);
  const [brandName, setBrandName] = useState();
  const [subcategoryName, setSubCategoryName] = useState("");
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    axiosClient
      .post("/GetSubCategoryList", {
        brandName: brandName ? brandName : categoryList[0],
      })
      .then((response) => {
        if (response.status === 200) {
          setSubCategoryList(response.data.subCategory);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [brandName]);

  function AddData() {
    if (
      brandName.length < 1 ||
      subcategoryName.length < 1 ||
      category.length < 1
    ) {
      toast.error("Please Fill the inputs");
      return;
    }

    axiosClient
      .post("/AddMainPageProducts", {
        brandName: brandName,
        category: category,
        categoryName: subcategoryName,
      })
      .then((response) => {
        toast.success("Successfully added");
        closeContainer();
      })
      .catch((error) => {
        toast.error(`Category ${category} already exists`);
      });
  }

  return (
    <div className="change-carrousal-container">
      <div>
        <label htmlFor="brand">Select Brand </label>
        <select
          onChange={(e) => setBrandName(e.target.value)}
          value={brandName}
          required
          className="custom-select"
        >
          <option value="">Select Brand</option>
          {categoryList.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="brand">Select Category </label>
        <select
          onChange={(e) => setSubCategoryName(e.target.value)}
          value={subcategoryName}
          required
          className="custom-select"
        >
          <option value="">Select Brand Category</option>
          {subCategoryList?.map((category, index) => (
            <option key={index} value={category.subBrandName}>
              {category.subBrandName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="brand">Select </label>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          required
          className="custom-select"
        >
          <option value="">Select Category</option>
          <option value="Sale">Sale</option>
          <option value="New Collection">New Collection</option>
        </select>
      </div>

      <button className="custom-button" onClick={AddData}>
        Add
      </button>
      <ToastContainer />
    </div>
  );
}

// import { useQuery, useMutation, queryCache } from 'react-query';

function DisplayCard() {
  const { query } = useRequestProcessor();
  const [count, setCount] = useState(0);

  const { data, isLoading, isError } = query(
    "mainPageBrands",
    async (req, res) => {
      try {
        const response = await axiosClient.get("/GetMainPageProducts");
        if (response) return response.data;
      } catch (error) {
        throw new Error("Error getting main page categories");
      }
    }
  );

  // Use useMutation to handle the delete operation
  const mutation = useMutation(
    (id) => axiosClient.post("/DeleteMainPageProducts", { id }),
    {
      onSuccess: () => {
        toast.success("Record deleted successfully");
        setCount((prevCount) => prevCount + 1);
        // queryCache.invalidateQueries("mainPageBrands");
      },
      onError: (err) => {
        toast.error("Error while deleting record");
        console.error(err);
      },
    }
  );

  const deleteRecord = (id) => {
    mutation.mutate(id);
  };

  if (isLoading) return <></>;
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <div>
      {data?.data.length === 0 && (
        <div className="wrapper">
          <div className="display-flex-col no-data-container">
            <img src={noDataImage} alt="no data image here" />
            <h5>No Data Found</h5>
          </div>
        </div>
      )}
      <br />
      {data.data.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Brand Name </StyledTableCell>
                <StyledTableCell >Category Name</StyledTableCell>
                <StyledTableCell >Category</StyledTableCell>
                <StyledTableCell >Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((item, index) => (
                <StyledTableRow key={index} style={{ height: "7vh" }}>
                  <StyledTableCell component="th" scope="row">
                    {item.brandName}
                  </StyledTableCell>
                  <StyledTableCell>{item.categoryName}</StyledTableCell>
                  <StyledTableCell>{item.category}</StyledTableCell>
                  <StyledTableCell>
                    <div onClick={() => deleteRecord(item._id)}>
                      <DeleteOutlineOutlinedIcon />
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ToastContainer />
    </div>
  );
}
