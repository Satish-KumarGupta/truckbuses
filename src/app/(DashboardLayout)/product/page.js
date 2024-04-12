'use client'
import React, { useState } from 'react'
import { Container, Col, Row, Card, CardBody, CardTitle } from "reactstrap";
import styles from '../../page.module.css'
import { useRouter } from 'next/navigation'
import Select from 'react-select'
import { options, tags, attributetab, handleChange, handleNumberChange, handleSubmit, handleSelectOption, handleSelectAttribute, handleVariationChange, handleVariationNumberChange, handleVariationAttributeChange, handleAddVariation, handleAddVariationOption, handleImage, handleGalleryImage, handleVariationOptionBoolean, handleVariationOptionNumberChange, removeFormFields, handleRemoveVariationOption, handleImageRemove, handleVariationOptionChange, removeFields } from "../components/common/comman";
import Input from '../components/reuseable/input';
import File from '../components/reuseable/file';
import Button from '../components/reuseable/button';
import validateForm from '../components/reuseable/validation';

import { storage } from '../components/firebase/firebase';
// firebase connections
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



const Product = () => {

  const router = useRouter()
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const initialVariationOption = {
    title: '',
    price: '',
    sale_price: '',
    quantity: 0,
    is_disable: 0,
    sku: '',
    options: []
  };
  const initialVriation = {
    attribute_id: 0,
    value: '',
    attribute: {
      slug: '',
      name: '',
      values: []
    }
  }


  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    images: [],
    gallery: [],
    tag: [],
    product_type: '',
    quantity: 0,
    price: '',
    sale_price: '',
    brand: '',
    weight: '',
    min_price: '',
    max_price: '',
    variations: [initialVriation],
    variation_options: [initialVariationOption]
  });

  const handleformSubmit = async (e) => {
    e.preventDefault()
    const errors = await validateForm(formData);
    if (errors) {
      setValidationErrors(errors)
      // console.log("form validation failed",errors);
    } else {
      // console.log('Form validation successful. Submitting form...');
      await handleSubmit(e, formData, router)
    }
  }

  const [model, setModel] = useState(false)

  const handleSelect = (selectedOption) => {

    setSelectedOptions(selectedOption)
    setFormData(prevFormData => ({
      ...prevFormData,
      // tag: selectedOption
      tag: [
        ...selectedOption.map(option => ({
          name: option.value,
          slug: option.label
        }))
      ]
    }));
  }

  const handleImage = async (e, index, formData, setFormData) => {
    e.preventDefault();
    // console.log("caa");
    const imageFile = e.target.files[0];
    try {

      const storageRef = ref(storage, `images/${imageFile.name}`);
      const uploadTask = await uploadBytes(storageRef, imageFile);
      // Get download URL of the uploaded file
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log('Image uploaded successfully!', downloadURL);

      const updatedImages = [...formData.images];
      updatedImages[index] = {
        thumbnail: downloadURL,
        original: downloadURL
      };

      // Update the state with the updated form data
      setFormData(prevState => ({
        ...prevState,
        images: updatedImages
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }

  }


  const handleAddImage = (e) => {
    e.preventDefault()
    setFormData(prevState => ({
      ...prevState,
      images: [...prevState.images, { thumbnail: '', original: '' }],
    }));
  };


  const data = {
    'variations[0].attribute.name': "Attribute name is required",

  }
  return (
    <>
      <Card >
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          Product
        </CardTitle>
        <form className={`${styles.formstyle}`} method="post" >
          <div className="bg-white shadow rounded mt-2">
            {/* <h5 className={ `m-2 text-blue-400 font-bold sm:text-2xl `}>User Registration</h5> */}
            <div class="container">
              <div class="row p-2">
                <div class="col-xl-6 ">
                  <div class="d-flex flex-column gap-4">
                    <Input text={'name'} onChange={(e) => handleChange(e, setFormData)} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} errors={validationErrors.name} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'slug'} onChange={(e) => handleChange(e, setFormData)} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} errors={validationErrors.slug} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'description'} onChange={(e) => handleChange(e, setFormData)} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={formData.description} errors={validationErrors.description} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'quantity'} onChange={(e) => handleNumberChange(e, setFormData)} typeinput="tel" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={formData.quantity} errors={validationErrors.quantity} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'price'} onChange={(e) => handleChange(e, setFormData)} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} errors={validationErrors.price} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'sale_price'} onChange={(e) => handleChange(e, setFormData)} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} errors={validationErrors.sale_price} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'brand'} onChange={(e) => handleChange(e, setFormData)} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} errors={validationErrors.brand} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'weight'} onChange={(e) => handleChange(e, setFormData)} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} errors={validationErrors.weight} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'brand'} onChange={(e) => handleChange(e, setFormData)} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} errors={validationErrors.brand} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'product_type'} onChange={(e) => handleChange(e, setFormData)} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} errors={validationErrors.product_type} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'min_price'} onChange={(e) => handleNumberChange(e, setFormData)} typeinput="string" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} value={formData.min_price} errors={validationErrors.min_price} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 gap-4">
                    <Input text={'max_price'} onChange={(e) => handleNumberChange(e, setFormData)} typeinput="string" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} value={formData.max_price} errors={validationErrors.max_price} />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="d-grid grid-cols-1 ">
                    <File text={'gallery'} onChange={(e) => handleGalleryImage(e, setFormData)} typeinput="file" option={true} stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} images={formData.gallery.length} gallery={formData.gallery} onClick={(index) => handleImageRemove(index, formData, setFormData)} errors={validationErrors.gallery} />
                  </div>
                </div>
                <div class="col-xl-6 m-auto mt-4 ">
                  <div className="d-grid grid-cols-1" >
                    <Select
                      isMulti={true}
                      value={selectedOptions}
                      onChange={handleSelect}
                      placeholder="Selected Tags"
                      options={options}
                    //  className="md:grid   lg:grid-cols-1 grid-cols-1 gap-4 flex  flex-col   items-center"
                    />
                    <span className="text-red-500">{validationErrors.tag}</span>
                  </div>
                </div>

                <div className={`col-xl-6`} stylediv={styles.containerdivright} inputstyle={styles.containerdivinput}>
                  {Object.keys(formData.images).map((key, index) => {
                    const image = formData.images[key];
                    console.log(image);
                    return (
                      <>
                        <File
                          key={index}
                          text={`Image ${index + 1}`}
                          onChange={(e) => handleImage(e, index, formData, setFormData)}
                          typeinput="file"
                          option={false}
                          stylediv={styles.containerdivright}
                          inputstyle={styles.containerdivinput}
                          image={image.original}
                          errors={validationErrors?.images && validationErrors?.images[index]}
                        />
                        <Button onClick={(e) => removeFields(e, index, formData, setFormData)}
                          styles={`col-sm-6 mx-auto  p-2 ml-5  ${formData.images.length > 0 ? 'hover:bg-red-400 hover:text-white outline outline-1 font-weight-bold' : 'opacity-50  cursor-not-allowed'}`}
                          disabled={formData.variations.length <= 1}
                          text={"Remove"}

                        />
                      </>
                    )
                  })}
                  <Button
                    onClick={handleAddImage}
                    styles={"col-sm-6 mx-auto p-2  mt-2 outline outline-1 hover:bg-blue-400 "}
                    text="Add Images"
                  />


                </div>
              </div>
            </div>
          </div>

          {/* { JSON.stringify(validationErrors)} */}
          <div className="bg-white p-2 shadow rounded">
            {formData.variations.map((option, index) => (
              <div className="mt-10" key={index}>

                <h4 className="text-lg ml-2 text-start text-blue-400 font-bold  ">Variations- </h4>

                <div class="container">
                  <div class="row p-2">
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'attribute_id'} onChange={(e) => { handleVariationNumberChange(e, index, setFormData) }} typeinput="tel" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={option?.attribute_id}
                          errors={validationErrors?.[`variations[${index}].attribute_id`]}
                        /> </div>
                    </div>
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'value'} onChange={(e) => { handleVariationChange(e, index, setFormData) }} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={option?.value}
                          errors={validationErrors?.[`variations[${index}].value`]}
                        />
                      </div>
                    </div>
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'slug'} onChange={(e) => { handleVariationAttributeChange(e, index, setFormData) }} typeinput="text" stylediv={styles.containerdivright}
                          inputstyle={styles.containerdivinput}
                          errors={validationErrors?.[`variations[${index}].attribute.slug`]}
                        />
                      </div>
                    </div>
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'name'} onChange={(e) => { handleVariationAttributeChange(e, index, setFormData) }} typeinput="text" stylediv={styles.containerdivright} inputstyle={`${styles.containerdivinput} `}
                          errors={validationErrors?.[`variations[${index}].attribute.name`]}
                        />
                      </div>
                    </div>
                    <div class="col-xl-6 m-auto  mt-4">
                      <div className="d-grid grid-cols-1" >
                        <Select
                          isMulti={true}
                          value={option?.attribute?.values?.name}
                          onChange={(selectedOptions) => handleSelectAttribute(selectedOptions, index, setFormData)}
                          placeholder="Selected Attribute"
                          options={attributetab}
                          className="md:grid   lg:grid-cols-1 grid-cols-2 gap-4 sm:flex  flex-col  items-center"

                        />
                        <span className="text-red-500">{validationErrors?.[`variations[${index}].attribute.values`]}</span>
                      </div>
                    </div>
                    <div class="col-xl-6 ">
                    </div>
                  </div>
                </div>
                <div className="d-grid grid-cols-2  sm:p-10 p-2">
                  <Button onClick={(e) => removeFormFields(e, index, formData, setFormData)}
                    styles={`col-sm-6 mx-auto p-2 ml-5 outline outline-1 ${formData.variations.length > 1 ? 'hover:bg-red-400 hover:text-white  opacity-100 text-bold' : ' opacity-50 bg-red cursor-not-allowed'}`}
                    disabled={formData.variations.length <= 1}
                    text={"Remove"}
                  />

                  <Button onClick={(e) => handleAddVariation(e, formData, setFormData)} styles={"col-sm-6 m-auto hover:bg-blue-300 outline outline-1 p-2"} text="Add More" />

                </div>
              </div>
            ))}
            <span>{validationErrors.variations}</span>
          </div>

          <div className="bg-white p-2 shadow rounded">

            {/* {JSON.stringify(formData.variation_options.length)} */}
            {formData.variation_options.map((option, index) => (
              <div key={index}>
                <h4 className="text-lg text-start text-blue m-2  font-bold ">Variation_Options </h4>

                <div class="container">
                  <div class="row p-2">
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'title'} onChange={(e) => { handleVariationOptionChange(e, index, setFormData) }} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={option?.title}
                          errors={validationErrors?.[`variation_options[${index}].title`]}
                        />
                      </div>
                    </div>
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'price'} onChange={(e) => { handleVariationOptionChange(e, index, setFormData) }} typeinput="number" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={option?.price}
                          errors={validationErrors?.[`variation_options[${index}].price`]}
                        />
                      </div>
                    </div>
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'sale_price'} onChange={(e) => { handleVariationOptionChange(e, index, setFormData) }} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={option?.sale_price}
                          errors={validationErrors?.[`variation_options[${index}].sale_price`]}
                        />
                      </div>
                    </div>
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'quantity'} onChange={(e) => { handleVariationOptionNumberChange(e, index, setFormData) }} typeinput="tel" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={option?.quantity}
                          errors={validationErrors?.[`variation_options[${index}].quantity`]}
                        />
                      </div>
                    </div>
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'is_disable'} onChange={(e) => { handleVariationOptionBoolean(e, index, setFormData) }} typeinput="tel" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={option?.is_disable} />
                      </div>
                    </div>
                    <div class="col-xl-6 ">
                      <div class="d-flex flex-column gap-4">
                        <Input text={'sku'} onChange={(e) => { handleVariationOptionChange(e, index, setFormData) }} typeinput="text" stylediv={styles.containerdivright} inputstyle={styles.containerdivinput} val={option?.sku}
                          errors={validationErrors?.[`variation_options[${index}].sku`]}
                        />
                      </div>
                    </div>
                    <div class="col-xl-6 m-auto  mt-4">
                      <div className="d-grid grid-cols-1" >
                        <Select
                          isMulti={true}
                          value={option.name}
                          onChange={(selectedOption) => handleSelectOption(selectedOption, index, formData, setFormData)}
                          placeholder=" Select Options"
                          options={tags}
                          // className="md:grid   lg:grid-cols-1 grid-cols-1 gap-4 flex  flex-col md:w-[400px] mt-5  items-center"
                        />
                        <span className="text-red-500">{validationErrors?.[`variation_options[${index}].options`]}</span>
                      </div>
                    </div>
                    <div class="col-xl-6 ">
                    </div>
                  </div>
                </div>              

                <div className="d-grid grid-cols-2  sm:p-10 p-2">

                  <Button onClick={(e) => handleRemoveVariationOption(e, index, formData, setFormData)}
                    styles={`col-sm-6 mx-auto p-2 ml-5 outline outline-1  ${formData.variation_options.length > 1 ? 'hover:bg-red-400 hover:text-white  opacity-100 text-bold' : ' opacity-50 bg-red cursor-not-allowed'}`}
                    disabled={formData.variation_options.length <= 1}
                    text="Remove"
                  />
                  <Button onClick={(e) => handleAddVariationOption(e, formData, setFormData)} styles="col-sm-6 m-auto  p-2 hover:bg-blue-300 outline outline-1 " text="Add More" />
                </div>

              </div>
            ))}
          </div>
          <div className="d-flex justify-end w-full  sm:p-10 p-2">
        
            <Button styles='col-6  border-2 text-green hover:bg-blue-300 outline outline-1 p-2' type="submit" onClick={(e) => handleformSubmit(e)} text={"Save"}></Button>
          </div>
        </form>
      </Card>
    </>
  )
}
export default Product;
