import React, { useEffect, useState } from 'react'
import styles from '../../../page.module.css'
import Image from 'next/image';
import { IoIosCloseCircle } from 'react-icons/io';
import Select from 'react-select'
import { options, tags, attributetab, handleChange, handleNumberChange, handleGalleryImage } from '../common/comman';
import validateForm from '../reuseable/validation';
import Input from '../reuseable/input';
import CustomConfirmation from '../reuseable/confirm';
import Button from '../reuseable/button';
import File from '../reuseable/file';
import { storage } from '../firebase/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const EditProduct = (props) => {
  const { data, oncancel, onUpdate } = props;
  console.log(data);
  const [formData, setFormData] = useState({
    name: data?.name,
    slug: data?.slug,
    description: data?.description,
    images: data?.images,
    // images: {
    //   thumbnail: data?.images?.thumbnail || '',
    //   original: data?.images?.original || ''
    // },
    gallery: data.gallery,
    tag: data.tag,
    product_type: data.product_type,
    quantity: data.quantity,
    price: data.price,
    sale_price: data.sale_price,
    brand: data.brand,
    weight: data.weight,
    min_price: data.min_price,
    max_price: data.max_price,
    variations: data.variations,
    variation_options: data.variation_options
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([] | data.tag);
  const [selectedOptionsAttribute, setSelectedOptionsAttribute] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    const errors = await validateForm(formData)
    if (errors) {
      setValidationErrors(errors)
      console.log("form validation failed", errors);
    } else {
      setIsConfirmationOpen(true);

      // const _id = data._id;
      // onUpdate(formData, _id)
    }
  }

  //////////model /////////
  const handleConfirmUpdate = async () => {

    const _id = data._id;
    onUpdate(formData, _id)

    setIsConfirmationOpen(false); // Close modal after success or error
  };

  const handleCancelUpdate = () => {
    setIsConfirmationOpen(false);
  };




  useEffect(() => {
    setSelectedOptions(data.tag.map((tag => ({ value: tag.name, label: tag.slug }))))
    setSelectedOptionsAttribute(formData.variations.map((item) => item?.attribute))
    setSelectedOptionIndex(formData.variation_options.map((item) => item?.options))
  }, [data?.tag, formData.variation_options, formData.variations])


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // };

  // const handleNumberChange = (e) => {
  //   const { name, value } = e.target;
  //   const newValue = !isNaN(value) && value !== '' ? parseFloat(value) : 0;
  //   // const parsedValue = parseFloat(value); // Parse value to number
  //   setFormData(prevState => ({
  //     ...prevState,
  //     [name]: newValue // Store parsed value
  //   }));
  // };

  const handleImage = async (e, index, formData, setFormData) => {
    e.preventDefault();
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

  console.log(formData);

  const handleImageRemove = (index) => {

    let updated = [...formData.gallery]
    updated.splice(index, 1)
    setFormData({
      ...formData,
      gallery: updated
    })

  }

  const handleImgRemove = (index) => {

    let updated = [...formData.images]
    updated.splice(index, 1)
    setFormData({
      ...formData,
      images: updated
    })

  }


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

  const handleVariationChange = (e, index) => {

    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      variations: prevState.variations.map((option, i) => {
        if (i === index) {
          return {
            ...option,
            [name]: value
          };
        }
        return option;
      }),

    }));

  }


  const handleVariationNumberChange = (e, index) => {

    const { name, value } = e.target;
    // const parsedValue = parseFloat(value);
    const newValue = !isNaN(value) && value !== '' ? parseFloat(value) : 0;
    setFormData(prevState => ({
      ...prevState,
      variations: prevState.variations.map((option, i) => {
        if (i === index) {
          return {
            ...option,
            [name]: newValue
          };
        }
        return option;
      }),

    }));

  }

  const handleVariationAttributeChange = (e, index) => {
    e.preventDefault();
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      variations: prevState.variations.map((item, i) => {
        if (i === index) {

          return {
            ...item,
            attribute: {
              ...item.attribute,
              [name]: value
            }
          };
        }
        return item;
      })
    }))
  }

  const handleAddVariation = (e) => {
    e.preventDefault()
    setFormData({
      ...formData,
      variations: [
        ...formData.variations,
        {
          attribute_id: '',
          value: '',
          attribute: {
            slug: '',
            name: '',
            values: []
          }
        }
      ]
    })
  }

  const handleAddVariationOption = (e) => {
    e.preventDefault()
    setFormData({
      ...formData,
      variation_options: [
        ...formData.variation_options,
        {
          title: '',
          price: '',
          sale_price: '',
          quantity: '',
          is_disable: '',
          sku: '',
          options: []
        },
      ],
    });
  };

  const handleSelectAttribute = (selectedOption, index) => {

    const attributeOptions = selectedOption.map(option => ({
      attribute_id: option?.id, // Assuming label corresponds to the name property in options
      value: option?.value
    }));
    // setSelectedOptionsAttribute(selectedOption)
    setFormData(prevFormData => {
      const updatedVariationOptions = [...prevFormData.variations]
      updatedVariationOptions[index].attribute.values = attributeOptions;
      console.log(updatedVariationOptions);
      return {
        ...prevFormData,
        variations: updatedVariationOptions
      };
    })

  }

  const removeFormFields = (index) => {
    console.log(index);
    let newvariations;
    if (formData.variations.length > 1) {
      newvariations = formData.variations.filter((_, i) => i !== index)
    } else {
      newvariations = formData.variations;
    }
    setFormData({
      ...formData,
      variations: newvariations
    });
  }
  const handleRemoveVariationOption = (index) => {
    let newVariationOptions;
    if (formData.variation_options.length > 1) {
      newVariationOptions = formData.variation_options.filter((_, i) => i !== index)
    } else {
      newVariationOptions = formData.variation_options;
    }

    setFormData({
      ...formData,
      variation_options: newVariationOptions

    });
  };

  const handleVariationOptionChange = (index, e) => {
    e.preventDefault();

    const { name, value } = e.target;
    console.log(name, value, index);

    setFormData(prevState => ({
      ...prevState,
      variation_options: prevState.variation_options.map((option, i) => {
        if (i === index) {

          return {
            ...option,
            [name]: value
          };
        }
        return option;
      })
    }));
  };
  const handleVariationOptionNumberChange = (index, e) => {
    e.preventDefault();

    const { name, value } = e.target;
    console.log(name, value, index);
    // const parsedValue = parseFloat(value);
    const newValue = !isNaN(value) && value !== '' ? parseFloat(value) : 0;
    setFormData(prevState => ({
      ...prevState,
      variation_options: prevState.variation_options.map((option, i) => {
        if (i === index) {

          return {
            ...option,
            [name]: newValue
          };
        }
        return option;
      })
    }));
  };

  const handleSelectoption = (selectedOption, index) => {

    const updatedOptions = selectedOption.map(option => ({
      name: option.label, // Assuming label corresponds to the name property in options
      value: option.value
    }));


    setFormData(prevState => {
      const updatedVariationOptions = [...prevState.variation_options];
      console.log("updated", updatedVariationOptions);
      updatedVariationOptions[index] = {
        ...updatedVariationOptions[index],
        options: updatedOptions
      };

      return {
        ...prevState,
        variation_options: updatedVariationOptions
      };
    });

  }

  const handleVariationOptionBoolean = (index, e) => {
    e.preventDefault();
    const { name } = e.target;

    setFormData(prevState => ({
      ...prevState,
      variation_options: prevState.variation_options.map((option, i) => {
        if (i === index) {

          return {
            ...option,
            [name]: !option.is_disable
          };
        }
        return option;
      })
    }));
  }
  const handleAddImage = (e) => {
    e.preventDefault()
    setFormData(prevState => ({
      ...prevState,
      images: [...prevState.images, {}],
    }));
  };
  return (
    <div className={`w-full sm:p-5 `}>
      <h1 className={styles.heading}>Record Details Edit({data?._id})</h1>

      <div className='bg-white rounded'>

        <div className='md:grid gap-5 p-2  lg:grid-cols-2  grid-cols-1 flex  flex-col'>

          <Input
            type="text"
            text="name"
            val={formData?.name}
            onChange={(e) => handleChange(e, setFormData)}
            stylediv={styles.containerdivright}
            inputstyle={styles.containerdivinput}
            errors={validationErrors.name}
          />
          <label className={`${styles.containerdivright} text-start`}>
            Slug:
            <input className={`${styles.containerdivinput} `}
              type="text"
              name="slug"
              value={formData.slug}
              onChange={(e) => handleChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.slug}</span>
          </label>
          <label className={`${styles.containerdivright} text-start`}>
            Description:
            <input className={styles.containerdivinput}
              type="text"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.description}</span>
          </label>
          <label className={`${styles.containerdivright} text-start`}>
            Quantity:
            <input className={styles.containerdivinput}
              type="tel"
              name="quantity"
              value={formData.quantity}
              onChange={(e) => handleNumberChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.quantity}</span>
          </label>
          <label className={`${styles.containerdivright} text-start`}>
            Price:
            <input className={styles.containerdivinput}
              type="text"
              name="price"
              value={formData.price}
              onChange={(e) => handleChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.price}</span>
          </label>
          <label className={`${styles.containerdivright} text-start`}>
            Sale Price:
            <input className={styles.containerdivinput}
              type="text"
              name="sale_price"
              value={formData.sale_price}
              onChange={(e) => handleChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.sale_price}</span>
          </label>
          <label className={`${styles.containerdivright} text-start`}>
            Brand:
            <input className={styles.containerdivinput}
              type="text"
              name="brand"
              value={formData.brand}
              onChange={(e) => handleChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.brand}</span>
          </label>
          <label className={`${styles.containerdivright} text-start`}>
            Weight:
            <input className={styles.containerdivinput}
              type="text"
              name="weight"
              value={formData.weight}
              onChange={(e) => handleChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.weight}</span>
          </label>


          <label className={`${styles.containerdivright} text-start`}>
            Product Type:
            <input className={styles.containerdivinput}
              type="text"
              name="product_type"
              value={formData.product_type}
              onChange={(e) => handleChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.product_type}</span>
          </label>
          <label className={`${styles.containerdivright} text-start`}>
            Minimun Price:
            <input className={styles.containerdivinput}
              type="text"
              name="min_price"
              value={formData.min_price}
              onChange={(e) => handleNumberChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.min_price}</span>
          </label>
          <label className={`${styles.containerdivright} text-start`}>
            Maximum Price:
            <input className={styles.containerdivinput}
              type="number"
              name="max_price"
              value={formData.max_price}
              onChange={(e) => handleNumberChange(e, setFormData)}
            />
            <span className='text-red-600'>{validationErrors.max_price}</span>
          </label>
          <div className={`${styles.containerdivright} flex  flex-col text-start`}>
            Select Multiple Image
            <input className={styles.containerdivinput}
              // id="fileInput"
              type="file"
              accept=".png,.jpg"
              name="gallery"
              onChange={(e) => { handleGalleryImage(e, setFormData) }}
              multiple
            />
            <span className='text-red-600'>{validationErrors.gallery}</span>
            <div className="flex p-2 gap-2  ">
              {formData.gallery.length > 0 &&
                formData.gallery.map((item, index) => {
                  return (
                    <div key={item._id}
                      className="w-[100px]  flex flex-col justify-between text-center flex-wrap">
                      {/* <img src={item?.original ? `http://localhost:3000/Images/${item?.original}` : ''} alt='' width={100} height={100} /> */}
                      {/* <Image src={item?.original} className="  object-contain" width={200} height={100} /> */}
                      <img src={item?.original} className="  object-contain" width={200} height={100} />
                      <IoIosCloseCircle
                        className='cursor-pointer m-3 hover:fill-red-500'
                        onClick={() => { handleImageRemove(index) }} />

                    </div>

                  )
                })
              }
            </div>
          </div>

          <section className={`${styles.containerdivright} text-start`}>
            Select Tags:
            <Select
              isMulti={true}
              value={selectedOptions}
              onChange={handleSelect}
              placeholder="Selected Tags"
              options={options}

            />
            <span className='text-red-600'>{validationErrors.tag}</span>
          </section>

          <section className={`${styles.containerdivright} flex  flex-col text-start `}>
            Select Image:
            
            <div className="col-xl-6 p-2 gap-2 flex-wrap">
              {formData.images.length > 0 &&
                formData.images.map((item, index) => {
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
                        image={item[index]?.original}
                        errors={validationErrors?.images && validationErrors?.images[index]}
                      />
                      <img src={item.original} width={100} height={50} />
                      {/* <img src={item?.original ? `http://localhost:3000/Images/` + item?.original : ''} width={100} height={50} /> */}
                      <IoIosCloseCircle
                        className='cursor-pointer m-3 hover:fill-red-500'
                        onClick={() => { handleImgRemove(index) }} />

                    </>
                  )
                })
                // <Image src={formData?.image?.original} width={100} height={100} />
              }
            </div>
            <Button
              onClick={handleAddImage}
              styles={"col-sm-6  p-2 ml-5  outline outline-1 hover:bg-blue-400 "}
              text="Add Images"
            />
          </section>
        </div>
        {formData?.variations?.map((option, index) => (
          <form className="mt-10" key={index}>
            <h1 className="text-lg text-start text-black ">Variations Form </h1>
            <div className={`md:grid gap-5 p-2 lg:grid-cols-2 grid-cols-1 md:gap-4 flex flex-col `}>
              <label className={`${styles.containerdivright} text-start`}>
                Attribute_id:
                <input className={styles.containerdivinput}
                  type="text"
                  name="attribute_id"
                  value={option?.attribute_id}
                  onChange={(e) => { handleVariationNumberChange(e, index) }}
                />
                <span className='text-red-600'>{validationErrors?.[`variations[${index}].attribute_id`]}</span>
              </label>
              <label className={`${styles.containerdivright} text-start`}>
                Value :
                <input className={styles.containerdivinput}
                  type="text"
                  name="value"
                  value={option?.value}
                  onChange={(e) => { handleVariationChange(e, index) }}
                />
                <span className='text-red-600'>{validationErrors?.[`variations[${index}].value`]}</span>
              </label>
              <label className={`${styles.containerdivright} text-start`}>
                Slug :
                <input className={styles.containerdivinput}
                  type="text"
                  name="slug"
                  value={option?.attribute?.slug}
                  onChange={(e) => { handleVariationAttributeChange(e, index) }}
                />

                <span className='text-red-600'>{validationErrors?.[`variations[${index}].attribute.slug`]}</span>
              </label>
              {/* </div>
              <div className={styles.containerdiv}> */}
              <label className={`${styles.containerdivright} text-start`}>
                Name:
                <input className={styles.containerdivinput}
                  type="text"
                  name="name"
                  value={option?.attribute?.name}
                  onChange={(e) => { handleVariationAttributeChange(e, index) }}
                />
                <span className='text-red-600'>{validationErrors?.[`variations[${index}].attribute.name`]}</span>
              </label>

              <label className={`${styles.containerdivright} text-start`}>
                Select Attribute:
                <Select
                  isMulti={true}
                  // value={selectedOptionsAttribute}
                  value={selectedOptionsAttribute[index]?.values?.map((val) => (
                    { value: val.value, label: val.value }
                  ))}
                  onChange={(selectedOptions) => handleSelectAttribute(selectedOptions, index)}
                  placeholder="Selected Attribute"
                  options={attributetab}
                />
                <span className="text-red-500">{validationErrors?.[`variations[${index}].attribute.values`]}</span>
              </label>
            </div>
             <div className="d-grid grid-cols-2  sm:p-10 p-2">
                  <Button onClick={(e) => removeFormFields(index)}
                    styles={`col-sm-6 mx-auto p-2 ml-5 outline outline-1 ${formData.variations.length > 1 ? 'hover:bg-red-400 hover:text-white  opacity-100 text-bold' : ' opacity-50 bg-red cursor-not-allowed'}`}
                    disabled={formData.variations.length <= 1}
                    text={"Remove"}
                  />

                  <Button onClick={ handleAddVariation} styles={"col-sm-6 m-auto hover:bg-blue-300 outline outline-1 p-2"} text="Add More" />

                </div>
          </form>
        ))}


        <div>

          {/* {JSON.stringify(formData.variation_options.length)} */}
          {formData.variation_options.map((option, index) => (
            <div key={index}>
              <h1 className="text-lg ">Variation_Options Form </h1>
              <div className={`md:grid gap-5 p-2 lg:grid-cols-2 grid-cols-1 md:gap-4 flex flex-col `}>

                <label className={`${styles.containerdivright} text-start`}>
                  Title:
                  <input className={styles.containerdivinput}
                    type="text"
                    name="title"
                    value={option.title}
                    onChange={(e) => { handleVariationOptionChange(index, e) }}
                  />
                  <span className="text-red-500">{validationErrors?.[`variation_options[${index}].title`]}</span>
                </label>
                <label className={`${styles.containerdivright} text-start`}>
                  Price:
                  <input className={styles.containerdivinput}
                    type="tel"
                    name="price"
                    value={option.price}
                    onChange={(e) => { handleVariationOptionNumberChange(index, e) }}
                  />
                  <span className="text-red-500">{validationErrors?.[`variation_options[${index}].price`]}</span>
                </label>
                <label className={`${styles.containerdivright} text-start`}>
                  sale_price:
                  <input className={styles.containerdivinput}
                    type="text"
                    name="sale_price"
                    value={option.sale_price}
                    onChange={(e) => { handleVariationOptionChange(index, e) }}
                  />
                  <span className="text-red-500">{validationErrors?.[`variation_options[${index}].sale_price`]}</span>
                </label>
               

                <label className={`${styles.containerdivright} text-start`}>
                  quantity:
                  <input className={styles.containerdivinput}
                    type="text"
                    name="quantity"
                    value={option.quantity}
                    onChange={(e) => { handleVariationOptionChange(index, e) }}
                  />
                  <span className="text-red-500">{validationErrors?.[`variation_options[${index}].quantity`]}</span>
                </label>

                <label className={`${styles.containerdivright} text-start`}>
                  is_disable:
                  <input className={styles.containerdivinput}
                    type="text"
                    name="is_disable"
                    value={option.is_disable}
                    onChange={(e) => { handleVariationOptionBoolean(index, e) }}
                  />
                </label>
                <label className={`${styles.containerdivright} text-start`}>
                  sku:
                  <input className={styles.containerdivinput}
                    type="text"
                    name="sku"
                    value={option.sku}
                    onChange={(e) => { handleVariationOptionChange(index, e) }}
                  />
                  <span className="text-red-500">{validationErrors?.[`variation_options[${index}].sku`]}</span>
                </label>

                <label className={`${styles.containerdivright} text-start`}>
                  <Select
                    isMulti={true}

                    value={selectedOptionIndex[index]?.map((options, ind) => (
                      { value: options.value, label: options.name }
                      // options[index] && { value: options.value, label: options.name }
                    ))}
                    // value={option.name}
                    onChange={(selectedOption) => handleSelectoption(selectedOption, index)}
                    placeholder=" Select Options"
                    options={tags}

                  />
                  <span className="text-red-500">{validationErrors?.[`variation_options[${index}].options`]}</span>

                </label>
              </div>
             
              <div className="d-grid grid-cols-2  sm:p-10 p-2">

              <Button onClick={() => handleRemoveVariationOption(index)}
                styles={`col-sm-6 mx-auto p-2 ml-5 outline outline-1  ${formData.variation_options.length > 1 ? 'hover:bg-red-400 hover:text-white  opacity-100 text-bold' : ' opacity-50 bg-red cursor-not-allowed'}`}
                disabled={formData.variation_options.length <= 1}
                text="Remove"
              />
              <Button onClick={handleAddVariationOption} styles="col-sm-6 m-auto  p-2 hover:bg-blue-300 outline outline-1 " text="Add More" />
              </div>
            </div>

          ))}
        </div>
        <div className="flex w-full justify-around p-10">
          <button className={'outline outline-1 sm:w-[400px] p-2 hover:bg-red-500'} onClick={oncancel}>Cancel</button>
          <button className={'outline outline-1 sm:w-[400px] p-2 hover:bg-green-500'} onClick={handleUpdate}>Update</button>
        </div>
      </div>

      {isConfirmationOpen && (
        <CustomConfirmation
          message="Are you sure you want to update the data?"
          onConfirm={handleConfirmUpdate}
          onCancel={handleCancelUpdate}
        />
      )}

    </div>
  )
}

export default EditProduct;
