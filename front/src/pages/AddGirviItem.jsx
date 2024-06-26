import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const AddGirviItem = () => {
  const [formData, setFormData] = useState({
    itemName:'',
    description: '',
    weight: '',
    label: '',
    imageUrl: '',
    customerId:'',
    photo: 'https://static.vecteezy.com/system/resources/thumbnails/027/717/343/small_2x/golden-diamond-gemstone-ring-generative-ai-photo.jpg',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("UserauthToken")) {
      navigate("/");
    }
    fetchAllCustomer();
    fetchAllItems();
  }, []);

  const fetchAllCustomer = () => {
    setLoading(true);
    fetch('https://gnj.onrender.com/api/auth/customers')
      .then(response => response.json())
      .then(data => {
        const options = data.map(customer => ({
          value: customer._id,
          label: customer.name
        }));
        setCustomerOptions(options);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching customer details:', error);
        setLoading(false);
      });
  };

  const fetchAllItems = () => {
    setLoading(true);
    fetch('https://gnj.onrender.com/api/auth/getallitems')
      .then(response => response.json())
      .then(data => {
        const options = data.map(item => ({
          value: item.itemName,  // Map itemName to the value
          label: item.itemName
        }));
        setItemOptions(options);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching item details:', error);
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Check if user uploaded an image
      if (image) {
        const formDatacloud = new FormData();
        formDatacloud.append('upload_preset', 'restrocloudnary'); // Replace 'restrocloudnary' with your actual upload preset name
        formDatacloud.append('cloud_name', 'dlq5b1jed'); // Replace 'dlq5b1jed' with your Cloudinary cloud name
        formDatacloud.append('file', image);
  
        // Upload image to Cloudinary
        fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
          method: 'POST',
          body: formDatacloud,
        })
          .then((cloudinaryResponse) => cloudinaryResponse.json())
          .then((cloudinaryData) => {
            console.log(cloudinaryData);
            formData.imageUrl = cloudinaryData.secure_url;
            // Now that formData is updated with the image URL (if uploaded), proceed to save data
            fetch("https://gnj.onrender.com/api/auth/items", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data); // Assuming the backend responds with a success message
                // Add any further actions after successful submission
              })
              .catch((error) => console.error('Error saving data:', error));
          })
          .catch((error) => console.error('Error uploading image to Cloudinary:', error));
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };


  const handleSubmit1 = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Before Data",formData);
    try {
      const response = await fetch("https://gnj.onrender.com/api/auth/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response,"response");

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log("After Data",formData);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error:", error.message);
      setLoading(false);
    }
  };
  

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: selectedOption.value
    }));
  };

  const handleCustomerChange = (selectedOption) => {
    setFormData(prevData => ({
      ...prevData,
      customerId: selectedOption.value
    }));
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4">
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-1">
          <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Add New Item</h1>
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="customerName" className="block text-sm font-medium leading-6 text-gray-900">Customer Name</label>
                    <div className="mt-2">
                      <Select
                        options={customerOptions}
                        id="customerId"
                        name="customerId"
                        className="block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={customerOptions.find(option => option.value === formData.customerId)}
                        onChange={handleCustomerChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                  <label htmlFor="itemName" className="block text-sm font-medium leading-6 text-gray-900">Item Name</label>
                      <div className="mt-2">
                        <Select
                          options={itemOptions}
                          id="itemName"
                          name="itemName"
                          className="block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={itemOptions.find(option => option.value === formData.itemName)}
                          onChange={handleSelectChange}
                        />
                      </div>
                    </div>

                  <div className="sm:col-span-2">
                      <label htmlFor="middlename" className="block text-sm font-medium leading-6 text-gray-900">
                       Description
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="description"
                          placeholder='description'
                          id="description"
                          value={formData['description']}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.middlename ? 'border-red-500' : ''
                            }`}
                        />
                      </div>
                    </div>
                  
                    <div className="sm:col-span-2">
                      <label htmlFor="middlename" className="block text-sm font-medium leading-6 text-gray-900">
                      Weight
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="weight"
                          placeholder='weight'
                          id="weight"
                          value={formData['weight']}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.middlename ? 'border-red-500' : ''
                            }`}
                        />
                      </div>
                    </div>

                  <div className="sm:col-span-2">
                      <label htmlFor="middlename" className="block text-sm font-medium leading-6 text-gray-900">
                      label
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="label"
                          placeholder='label'
                          id="label"
                          value={formData['label']}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.middlename ? 'border-red-500' : ''
                            }`}
                        />
                      </div>
                    </div>
                  <div className="sm:col-span-2">
                      <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                      Photo
                      </label>
                      <div className="mt-2">
                        <input
                          type="file"
                          name="photo"
                          id="photo"
                          onChange={handleImageUpload}
                          accept="image/*"
                          className={`block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.middlename ? 'border-red-500' : ''
                            }`}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="middlename" className="block text-sm font-medium leading-6 text-gray-900">
                      Price
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="price"
                          placeholder='price'
                          id="price"
                          value={formData['price']}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.middlename ? 'border-red-500' : ''
                            }`}
                        />
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
              <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
              <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save & Next</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default AddGirviItem;
