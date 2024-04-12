'use client'
import React,{useState,useEffect} from 'react'
import { Row, Col, Table, Card, CardTitle, CardBody,CardSubtitle } from "reactstrap";
import Style from '../../page.module.css'
import { useRouter } from 'next/navigation';
import { IoCloseCircleOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import {  toast } from 'react-toastify';
import CustomConfirmation from '../components/reuseable/confirm';
import { AiOutlineMenu } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";

import Image from "next/image";
import user1 from "public/images/users/user1.jpg";
import user2 from "public/images/users/user2.jpg";
import user3 from "public/images/users/user3.jpg";
import user4 from "public/images/users/user4.jpg";
import user5 from "public/images/users/user5.jpg";
import EditProduct from '../components/dashboard/editProduct';

const tableData = [
  {
    avatar: user1,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user2,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Lading pro React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user3,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Elite React",
    status: "holt",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user4,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user5,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Ample React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
];
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [show,setShow]=useState(false);
  const [data,setData]=useState()
  const [search,setSearch]=useState('')
  const router = useRouter()
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [operation,setOperation]=useState(false)

  // ////////////
  const fetchData = async () => {
    try {
      const result = await fetch("api/products");
      const data = await result.json();
      if (data.success) {
        setProducts(data.result);
      } else {
        console.error("Error fetching Products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };
  useEffect(() => {

    fetchData();
  }, []);

  
  const handleConfirmDelete = async() => {
   
    let response =await fetch("api/users/"+deleteItemId,{
       method:"DELETE"
     });
     response=await response.json();
     if(response.success){
       setIsConfirmationOpen(false); // Close modal after success or error
 
       toast.success('Delete successful!');
       // router.push('/user-list',{scroll:false})
       fetchData()
     }
   };
 
   const handleCancelUpdate = () => {
     setIsConfirmationOpen(false);
   };
 
   const handleDelete=async(id)=>{
     setDeleteItemId(id)
     setIsConfirmationOpen(true);
     // handleConfirmDelete(id)
 
     // // console.log(id);
     // let response =await fetch("http://localhost:3000/api/users/"+id,{
     //   method:"DELETE"
     // });
     // response=await response.json();
     // if(response.success){
 
     //   toast.success('Delete successful!');
     //   // router.push('/user-list',{scroll:false})
     //   fetchData()
     // }
   }
 
   const handleEdit=(data)=>{
     setData(data)
     setShow(!show)
 
   }
 
   // update and cancel op
   const handleCancel=()=>{
       setShow(!show)
   }
   const handleUpdate=async(data,id)=>{
     let result=await fetch(`api/products/${id}`,{
       method:"PUT",
       headers:{
         "Content-Type": "application/json"
       },
       body:JSON.stringify(data)
     })
     result=await result.json();
 
     if(result.success){
       toast.success('Update successful!');
       setShow(!show)
     }
     fetchData()
   }
   const [loading,setLoading]=useState(true);
 
   useEffect(()=>{
     setTimeout(()=>{
       setLoading(false)
     },5000)
   },[])
 
   const handleSearch=(e)=>{
     e.preventDefault();
     const search=e.target.value;
     setSearch(search)
   }
   const searching=async()=>{
     let result=await fetch(`api/search?name=${search}`)
     const data = await result.json();
     console.log(data);
     if(data.result.length > 0 )
     toast.success('Search successful!');
     else
     toast.warning("somting went wrong")
     setProducts(data.result);
   }
   const searchCall=()=>{
 
    if(search.length >0){
     searching()
    }else{
     fetchData()
    }
   }
 
 
   const flattenData = products.map(item => {
     // here we can modify which colums data we want to add 
     const flattenedItem = { ...item };
 
     if (flattenedItem.gallery) {
    
       // flattenedItem['Gallery ID']= (flattenedItem?.gallery[0]?._id)
       // flattenedItem.galleryThumbnail = flattenedItem.gallery.thumbnail.toString(0,32767);
       // flattenedItem.galleryOriginal = flattenedItem.gallery.original;
       // delete flattenedItem.gallery;
 
       // Convert gallery array to string
       flattenedItem.gallery = JSON.stringify(flattenedItem.gallery).substring(0,32767);
     }
     if(flattenedItem.images){
       flattenedItem.images = JSON.stringify(flattenedItem.images).substring(0,32767)
     }
     if(flattenedItem.tag){
       // flattenedItem['Tag Names'] = flattenedItem.tag.map(tag => tag.name).join(', ');
       // delete flattenedItem.tag;
       flattenedItem.tag=JSON.stringify(flattenedItem.tag).substring(0,32767)
     }
     if(flattenedItem.variations){
       flattenedItem.variations=JSON.stringify(flattenedItem.variations).substring(0,32767)
     }
     if(flattenedItem.variation_options){
       flattenedItem.variation_options=JSON.stringify(flattenedItem.variation_options).substring(0,32767)
     }
     return flattenedItem;
   });
 
   const handleExport = () => {
     const worksheet = XLSX.utils.json_to_sheet(flattenData);
     // const worksheet = XLSX.utils.json_to_sheet(data);
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
 
     // Buffer to store the generated Excel file
     const excelBuffer = XLSX.write(workbook, {
       bookType: "xlsx",
       type: "array",
     });
     const blob = new Blob([excelBuffer], {
       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
     });
     
     saveAs(blob, "users.xlsx");
     toast.success('File download successfully')
   };
   const handle=()=>{
    console.log("call");
    setOperation(!operation)
   }
  return (
    <Row>
       {loading ? <div className='w-full  text-center m-auto'>Loading Data</div>:
       <Card>
          <CardBody>
          {show ? (
          <div className='text-center'>
            <IoCloseCircleOutline className=' float-right  hover:bg-white bg-gray-400 w-[30px] h-[30px] text-center  p-1 rounded-full cursor-pointer' onClick={()=>{setShow(!show)}} />
            <EditProduct data={data} oncancel={handleCancel} onUpdate={handleUpdate}/>
           
          </div>)
          :(
          <>
            <CardTitle tag="h5">Project Listing</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              Overview of the projects
            </CardSubtitle>
            
            <div className='flex w-full justify-between  p-2 '>
            
            <div className='flex   items-center border-2  bg-white'>
                <input type='text' placeholder='Search Product List ' name='search' onChange={(e)=>handleSearch(e)} className='outline-none p-2' />
                <CiSearch className='flex text-center mr-2' onClick={searchCall}/>
            </div>
           
          
              
            <button className='bg-green-300 hover:bg-green-400 text-white font-bold px-2 rounded' onClick={()=>{handleExport(products)}}>Export data</button>
           
          
            </div>
            <div className="table-responsive">
              <Table className="text-nowrap mt-3 align-middle" borderless>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Slug</th>
                    <th>Brand</th>
                    <th>Operation</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {products?.length>0 ?products?.map((tdata, index) => {
                    
                    console.log(tdata)
                   return (
                    <tr key={index} className="border-top">
                      <td>
                        <div className="d-flex align-items-center p-2">
                          <Image
                            src={user1}
                            className="rounded-circle"
                            alt="avatar"
                            width="45"
                            height="45"
                          />
                          {/* <img src={"https://firebasestorage.googleapis.com/v0/b/curious-mender-320213.appspot.com/o/images%2FAll%20specifications%20%40%20features%20(1).png?alt=media&token=9499cb98-60ec-4ce5-8472-bc4bb8f83dd3"}
                           className="rounded-circle"
                           alt="avatar"
                           width="45"
                           height="45"
                         /> */}
                          <div className="ms-3">
                            <h6 className="mb-0">{tdata.name}</h6>
                            <span className="text-muted">{tdata.description}</span>
                          </div>
                        </div>
                      </td>
                      <td>{tdata.slug}</td>
                      <td>{tdata.brand}</td>
                      <td className='' onClick={()=>{operation? setOperation(false):''}}>
                      <AiOutlineMenu onClick={handle} className='cursor-pointer' />  
                        {operation  &&
                        (<div className='absolute flex flex-col bg-sky-200 mt-2 '>
                          <button className=" hover:bg-green-500 w-full text-black font-bold py-2 px-4 rounded mr-2" onClick={()=>handleEdit(tdata)}>Edit</button>
                          <button className=" hover:bg-red-700 text-black font-bold py-2 px-4 rounded " onClick={()=>{handleDelete(tdata._id)}}>Delete</button>          
                         </div>
                        )
                       
                       
                        }
                      </td>
                      {/* <td>
                        {tdata.status === "pending" ? (
                          <span className="p-2 bg-danger rounded-circle d-inline-block ms-3" />
                        ) : tdata.status === "holt" ? (
                          <span className="p-2 bg-warning rounded-circle d-inline-block ms-3" />
                        ) : (
                          <span className="p-2 bg-success rounded-circle d-inline-block ms-3" />
                        )}
                      </td> */}
                      {/* <td>{tdata.weeks}</td>
                      <td>{tdata.budget}</td> */}

                    </tr>
                  )})
                  :
                  'No Data Found'
                  }
                
                </tbody>
              </Table>
            </div>
            {/* {show && 
          <div className='absolute top-[50px] h-screen  overflow-auto md:w-[87%] w-full   bg-gray-400 opacity-80 text-center'>
            <IoCloseCircleOutline className=' float-right  hover:bg-white bg-gray-400 w-[30px] h-[30px] text-center  p-1 rounded-full cursor-pointer' onClick={()=>{setShow(!show)}} />
              
             <Editdetails data={data} oncancel={handleCancel} onUpdate={handleUpdate}/> 
           
          </div>
          } */}
            {isConfirmationOpen && (
                <CustomConfirmation
                  message="Are you sure you want to delete the data?"
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancelUpdate}
                />
            
          )}
          </>)
        }
          </CardBody>
        </Card>
       }
    </Row>
  )
}

export default ProductList;
