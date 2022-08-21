import { columns } from './Columns';
import { data } from './Data';
import MUIDataTable from "mui-datatables";

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Main() {
  const [search, setSearch] = useState("")
  const [searchMail, setsearchMail] = useState("")
  const [searchIp, setsearchIp] = useState("")
  const [filterData, setFilterData] = useState(data)

  // For Filtering by fullname  
  useEffect(() => {
    const val = data.filter((item) => {
      const fullName = `${item.first_name} ${item.last_name}`
      if (fullName.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
    })
    setFilterData(val)
  }, [search])

  // For Filtering by Mail 
  useEffect(() => {
    const val = data.filter((item) => {
      if (item.email.toLowerCase().includes(searchMail.toLowerCase())) {
        return item;
      }
    })
    setFilterData(val)
  }, [searchMail])

  // For Filtering by IP 
  useEffect(() => {
    const val = data.filter((item) => {
      if (item.ip_address.toLowerCase().includes(searchIp.toLowerCase())) {
        return item;
      }
    })
    setFilterData(val)
  }, [searchIp])

  // Reseting Input Fields And Reseting Array
  const reset = () => {
    if (!search == "" || !searchMail == "" || !searchIp == "") {
      return `${setSearch('')} ${setsearchMail('')} ${setsearchIp('')} ${setFilterData(data)}`
    } else if (search == "" || searchMail == "" || searchIp == "") {
      return `${setFilterData(data)}`
    }
  }
  const showTotal = filterData.reduce((total, item) => {
    return total + item.price
  }, 0)


  // Showing Full Price
  const showTotalPrice = filterData.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  // For DropDown
  const [gender, setGender] = useState('');

  const genFil = () => {
    const result = data.filter((item) => {
      if (item.gender.includes(gender)) {
        return item
      }
    })
    setFilterData(result);
  }
  useEffect(() => {
    genFil();
  }, [gender]);


  const nonDuplicates = []
  const val = data.filter((item) => {
    const gen = nonDuplicates.includes(item.gender)
    if (!gen) {
      nonDuplicates.push(item.gender)
      return true
    }
    return false
  })
  // For Opening Modal
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const handleModalClose = () => {
    setShow(false);
  }
  const handleModalShow = () => {
    setShow(true);
  }
  const toggleModal = () => {
    setShowModal(handleModalShow)
  }
  const ModalContent = () => {


    return (
      <div>
        <Modal
          open={show}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              First Name : {modalInfo[1]}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Last Name : {modalInfo[2]}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Email : {modalInfo[3]}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Gender : {modalInfo[4]}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Date : {modalInfo[5]}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              IP Address : {modalInfo[6]}
            </Typography>
          </Box>
        </Modal>
      </div>
    )
  }

  const handleOnRowClick = (rowData, rowMeta) => {
    toggleModal();
    setModalInfo(rowData, rowMeta)
    console.log(rowData, rowMeta);
  }

  // For CSV 
  const printCSV = () => {
    const newData = data.map(row => {
      delete row.tableData
      return row
    })
    const workSheet = XLSX.utils.json_to_sheet(newData)
    const workBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workBook, workSheet, "employee")

    let buf = XLSX.write(workBook, { bookType: "csv", type: "buffer" })

    XLSX.write(workBook, { bookType: "csv", type: "binary" })

    XLSX.writeFile(workBook, "EmployeeData.csv")
  }

  // For Excel
  const printExcel = () => {
    const newData = data.map(row => {
      delete row.tableData
      return row
    })
    const workSheet = XLSX.utils.json_to_sheet(newData)
    const workBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workBook, workSheet, "employee")

    let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })

    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    XLSX.writeFile(workBook, "EmployeeData.xlsx")
  }

  // For PDF 
  const printPDF = () => {
    const doc = new jsPDF()
    doc.text("Employee Details", 20, 10)
    // doc.autoTable({
    //   theme: "grid",
    //   columns: columns.map(col => ({ ...col, dataKey: col.field })),
    //   body: data
    // })
    autoTable(doc, {
      head: columns.map(col => ({ ...col, dataKey: col.field })),
      body: data
        // ...
      
    })
    doc.save('Employee.pdf')
  }

  const navigate = useNavigate()
  
  useEffect(() => {
    let auth = localStorage.getItem('user');
    if (!auth) {
        navigate('/');
    }
  }, []);

  const logout = () => {
    let auth = localStorage.removeItem('user');
    if (!auth) {
        navigate('/');
    }
  }

  return (
    <div className="App">
        

      <h1>Total Price</h1>
      <h1>Total Price {showTotal}</h1>
      <h1>Total Price {showTotalPrice}</h1>

      {/* // For fullname filter   */}
      <input type='text' placeholder='FullName' value={search} className='search' onChange={(e) => setSearch(e.target.value)} />

      {/* // For email filter  */}
      <input type='text' placeholder='Email' value={searchMail} className='search' onChange={(e) => setsearchMail(e.target.value)} />



      {/* Drop Down */}
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value={"Select Gender" ? "" : gender}>
          Select Gender
        </option>
        {val.map((item) => {
          return (
            <option value={item.gender} key={item.gender}>
              {item.gender}
            </option>
          )
        })}
      </select>
      {/* Drop Down */}

      {/* // For ip filter   */}
      <input type='text' placeholder='Ip Address' value={searchIp} className='search' onChange={(e) => setsearchIp(e.target.value)} />

      <button className='reset-btn' onClick={reset}> Reset </button>

      <button className='print' onClick={printCSV}>Print CSV</button>
      <button className='print' onClick={printExcel}>Print XLSX</button>
      <button className='print' onClick={printPDF}>Print PDF</button>
      <button className='print' onClick={logout}>Logout</button>

      <MUIDataTable
        title={"Employee List"}
        data={filterData}
        columns={columns}

        options={{
          onRowClick: handleOnRowClick,
          download: false,
          jumpToPage: true,
          print: false,
          search: false,
          viewColumns: false,
          filterType: false,
        }}
      />
      {show ? <ModalContent /> : ""}
      

    </div>

  );
}
export default Main;