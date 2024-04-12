"use client"
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';
import styles from '../../page.module.css'
import { Row, Col, Table, Card, CardTitle, CardBody, CardSubtitle } from "reactstrap";

import { FaFileAlt } from "react-icons/fa";
import { IoCloseCircleOutline } from 'react-icons/io5';
import EditProduct from '../components/dashboard/editProduct';
import Link from 'next/link';
import { toast } from 'react-toastify';
import user1 from "public/images/users/user1.jpg";
import { AiOutlineMenu } from "react-icons/ai";
import Image from "next/image";

const ImportFile = () => {

    const [dataset, setData] = useState(null);
    const [filename, setFileName] = useState()
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [operation,setOperation]=useState(false)
    let parsedData;

    useEffect(() => {
        const dataFromSessionStorage = JSON.parse(sessionStorage.getItem('data'));
        const filename = sessionStorage?.getItem('filename')
        setFileName(filename)
        setData(dataFromSessionStorage)

    }, [])
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 5000)
    }, [])

    const get = () => {
        const dataFromsessionStorage = sessionStorage.getItem('data');
        if (dataFromsessionStorage) {
            setData(JSON.parse(dataFromsessionStorage));
        }
    }
    const handleFileChange = (event) => {
        console.log("call again");
        // event.preventDefault();
        const file = event?.target?.files[0];
        // if (!file) return;
        if (file) {

            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);

                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // jsonData.map((item)=>{
                //   console.log(JSON.parse(item.image));
                // })
                parsedData = jsonData?.map(item => {

                    item.images = JSON.parse(item?.images);

                    if (item.gallery) {
                        item.gallery = JSON.parse(item.gallery);
                    }
                    if (item.tag) {
                        item.tag = JSON.parse(item.tag)
                    }
                    if (item.variations) {
                        item.variations = JSON.parse(item.variations);
                    }
                    if (item.variation_options) {
                        item.variation_options = JSON.parse(item.variation_options);
                    }
                    // Repeat this process for other nested properties
                    return item;
                });
                setData(parsedData)
                setFileName(file.name)
                sessionStorage.setItem("data", JSON.stringify(parsedData))
                sessionStorage.setItem("filename", file.name)
            }
            reader.readAsArrayBuffer(file);
        } else {
            console.log("dd");
        }
    }
    const handleDelete = async (id) => {

        let response = await fetch("api/products/" + id, {
            method: "DELETE"
        })
        response = await response.json();
        if (response.success === true) {
            const updatedDataset = dataset.filter(item => item._id !== id);
            sessionStorage.setItem('data', JSON.stringify(updatedDataset));
            setData(updatedDataset);
            toast("Record Deleted Success-fully")

        } else {
            toast("Failed to delete record");
        }
    }

    const handleEdit = (data) => {
        setData(data)
        setShow(!show)

    }
    const handleCancel = (e) => {
        setShow(!show)
        get()
    }

    const handleUpdate = async (data, id) => {
        let result = await fetch(`api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        result = await result.json();


        if (result.success) {
            toast("Record Updated Succes-full");
            setShow(!show)

        }
        // fetchData()
    }
    const handle=()=>{
        console.log("call");
        setOperation(!operation)
       }
    console.log(dataset);
    return (
        <Row>
            {loading ? <div className='w-full  text-center m-auto'>Loading Data</div> :
                <Card>
                    <CardBody>
                        {show ? (
                            <div className='text-center'>
                                <IoCloseCircleOutline className=' float-right  hover:bg-white bg-gray-400 w-[30px] h-[30px] text-center  p-1 rounded-full cursor-pointer' onClick={handleCancel} />
                                <EditProduct data={dataset} oncancel={handleCancel} onUpdate={handleUpdate} />

                            </div>)
                            : (
                                <>
                                    <CardTitle tag="h5">Project Listing</CardTitle>
                                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                                        Overview of the projects
                                    </CardSubtitle>
                                    <div className='flex w-full justify-end  p-2 '>
                                        <div className='flex '>
                                            <h1 className='text-xl  '>Upload File</h1>
                                            <FaFileAlt className='w-fit text-3xl cursor-pointer hover:fill-slate-400' onClick={() => document.getElementById('filePicker').click()} />
                                        </div>
                                        <input type='file' id="filePicker" accept='.csv, .xlsx' style={{ display: 'none' }} onChange={handleFileChange} />
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

                                                {dataset?.length > 0 ? dataset.map((tdata, index) => {

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
                                                                
                                                                    <div className="ms-3">
                                                                        <h6 className="mb-0">{tdata.name}</h6>
                                                                        <span className="text-muted">{tdata.description}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{tdata.slug}</td>
                                                            <td>{tdata.brand}</td>
                                                            <td className='' onClick={() => { operation ? setOperation(false) : '' }}>
                                                                <AiOutlineMenu onClick={handle} className='cursor-pointer' />
                                                                {operation &&
                                                                    (<div className='absolute flex flex-col bg-sky-200 mt-2 '>
                                                                        <button className=" hover:bg-green-500 w-full text-black font-bold py-2 px-4 rounded mr-2" onClick={() => handleEdit(tdata)}>Edit</button>
                                                                        <button className=" hover:bg-red-700 text-black font-bold py-2 px-4 rounded " onClick={() => { handleDelete(tdata._id) }}>Delete</button>
                                                                    </div>
                                                                    )
                                                                }
                                                            </td>
                                                          

                                                        </tr>
                                                    )
                                                })
                                                    :
                                                    'No Data Found'
                                                }

                                            </tbody>
                                        </Table>
                                    </div>
                                </>
                            )}
                    </CardBody>
                </Card>
            }

        </Row>
    )
}

export default ImportFile;
