import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import LinearProgress from "@material-ui/core/LinearProgress"
import Axios from "axios"
import { Table, TableBody, TableCell, TableContainer, FormControl, InputLabel, Select, MenuItem, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material"
import ClearIcon from "@material-ui/icons/Clear"
import { TablePagination, IconButton } from "@material-ui/core"
import SearchBar from "material-ui-search-bar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
function Main() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [headers, setHeaders] = useState([])
  const [data, setData] = useState([])
  const [filename, setFilename] = useState("")
  const [listData, setListData] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searched, setSearched] = useState("")
  const [originalData, setOriginalData] = useState([])
  const [searchBy, setSearchBy] = useState("id") // Default search by "id"

  const handleFileChange = event => {
    if (event.target.files[0] && event.target.files[0].name) {
      setFilename(event.target.files[0].name)
      setFile(event.target.files[0])
    } else {
      console.log(file)
    }
  }

  const clearFilename = () => {
    setFilename("")
    setFile(null)
  }
  const handleUpload = () => {
    console.log(file)
    if (file) {
      const formData = new FormData()
      formData.append("file", file)

      // Read file content
      const reader = new FileReader()
      reader.onload = function (event) {
        const csvContent = event.target.result
        // Split the CSV content into rows
        const rows = csvContent.split("\n")
        // Extract headers from the first row
        const headers = rows[0].split(",")
        // Initialize an array to store the parsed data
        const data = []

        // Parse data skipping the first row (which contains headers)
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].split(",")
          // Create an object to represent each row of data
          const rowData = {}
          // Store each column value with its corresponding header
          for (let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = row[j]
          }
          // Add the row data object to the data array
          data.push(rowData)
        }
        setHeaders(headers)

        setData(data)
        sendData(data)
        setUploading(true)
      }
      reader.readAsText(file)
    }
  }
  const sendData = async data => {
    try {
      const response = await Axios.post(
        `http://localhost:8080/sendData`,
        { data },
        {
          onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent
            const progress = (loaded / total) * 100
            setProgress(progress)
            if (progress >= 100) {
              getData()
              setUploading(false)
              setProgress(0)
            }
          }
        }
      )
      if (response.data.error == true) {
        toast.error("Upload Failed", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
        })
      } else {
        toast.success("Upload Successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
        })
      }

      // Once the upload is complete, you can call getData() or perform any other actions.
      getData()
      setUploading(false)
      setProgress(0)
    } catch (error) {
      // Handle error if needed
      console.log("Inhere")
    }
  }
  const getData = async () => {
    try {
      const response = await Axios.get(`http://localhost:8080/getData`)
      console.log(response.data)

      setListData(response.data)
      setOriginalData(response.data)
    } catch (error) {}
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchByChange = event => {
    getData()
    setSearchBy(event.target.value)
  }

  const requestSearch = searchedVal => {
    if (searchedVal.trim() === "") {
      getData() // Call getData() when the search bar is empty
    } else {
      const filteredRows = originalData.filter(row => {
        // Check if the selected searchBy attribute exists and filter based on it
        return row[searchBy] && row[searchBy].toString().toLowerCase().includes(searchedVal.toLowerCase())
      })
      setListData(filteredRows)
    }
  }

  const cancelSearch = () => {
    setSearched("")
    requestSearch(searched)
    getData()
  }

  useEffect(() => {
    getData()
  }, [])
  return (
    <div>
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Upload buttons */}
        <div>
          <input accept=".csv" id="contained-button-file" type="file" style={{ display: "none" }} onChange={handleFileChange} />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Choose CSV File
            </Button>
          </label>
          <Button variant="contained" color="primary" onClick={handleUpload} disabled={!file || uploading} style={{ marginLeft: "10px" }}>
            Upload
          </Button>
          <TextField value={filename}></TextField>
          <IconButton onClick={clearFilename}>
            <ClearIcon />
          </IconButton>
          {uploading && <LinearProgress variant="determinate" value={progress} />}
        </div>
      </div>

      {/* Search bar and dropdown */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FormControl>
            <Select labelId="search-by-label" id="search-by-select" value={searchBy} onChange={handleSearchByChange} style={{ minWidth: "120px", marginRight: "10px" }}>
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="postId">Post ID</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="body">Body</MenuItem>
            </Select>
          </FormControl>
          <SearchBar value={searched} onChange={searchVal => requestSearch(searchVal)} onCancelSearch={() => cancelSearch()} />
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>PostId</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Body</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0 ? listData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : listData).map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.postId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.body}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={listData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
      </TableContainer>
      <ToastContainer />
    </div>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)
