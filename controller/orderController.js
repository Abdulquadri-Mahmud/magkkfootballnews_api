import React, { useState } from 'react';
import { FaNairaSign } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreateOrder() {
  const { items } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  let total = 0;

  const [formData, setFormData] = useState({
    firstname: currentUser?.firstname || '',
    lastname: currentUser?.lastname || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    items: items || [],
  });

  console.log('Form Data:', formData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `https://fake-api-one-rust.vercel.app/api/order/create_orders`;

    try {
      setLoading(true);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorDetails = await res.text();
        console.error('Error Response:', errorDetails);
        setError(`Server Error: ${errorDetails}`);
        return;
      }

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Something went wrong');
        return;
      }

      // Success
      setSuccess(true);
      setError('');
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Fetch Error:', error);
      setError(error.message || 'An unexpected error occurred');
      toast.error(`Error: ${error.message || 'Failed to create gadget'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-200">
      <div className="2xl:max-w-[80%] xl:max-w-[90%] max-w-[100%] mx-auto">
        <div>
          <div className="py-4 px-4 bg-white flex gap-2 font-medium text-sm">
            <p>
              <Link to={'/'}>Home / </Link>
            </p>
            <p>
              <Link to={'/cart'}>cart / </Link>
            </p>
            <p>
              <Link to={'/create-order'} className="text-gray-500">
                Checkout
              </Link>
            </p>
          </div>
          <div className="py-5 px-2">
            <div className="p-4 bg-blue-900 rounded-t-md">
              <h2 className="text-2xl font-medium text-white">Basic Information</h2>
            </div>
            <div className="flex justify-between gap-3 flex-wrap">
              <form onSubmit={handleSubmit} className="font-medium md:w-[55%] w-full bg-white py-3 rounded-b-md">
                <div className="grid md:grid-cols-2 gap-3 grid-cols-1 p-3">
                  <div>
                    <p>First Name</p>
                    <input
                      onChange={handleChange}
                      value={formData.firstname}
                      type="text"
                      id="firstname"
                      className="outline-none border border-gray-200 placeholder:text-sm font-normal w-full rounded-md p-2"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <p>Last Name</p>
                    <input
                      onChange={handleChange}
                      value={formData.lastname}
                      type="text"
                      id="lastname"
                      className="outline-none border border-gray-200 placeholder:text-sm font-normal w-full rounded-md p-2"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 grid-cols-1 p-3">
                  <div>
                    <p>Phone Number</p>
                    <input
                      onChange={handleChange}
                      value={formData.phone}
                      type="text"
                      id="phone"
                      className="outline-none border border-gray-200 placeholder:text-sm font-normal w-full rounded-md p-2"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div>
                    <p>Email Address</p>
                    <input
                      onChange={handleChange}
                      value={formData.email}
                      type="email"
                      id="email"
                      className="outline-none border border-gray-200 placeholder:text-sm font-normal w-full rounded-md p-2"
                      placeholder="Email Address"
                    />
                  </div>
                </div>

                <div className="p-3">
                  <p>Full Address</p>
                  <textarea
                    id="address"
                    onChange={handleChange}
                    value={formData.address}
                    className="outline-none w-full h-[80px] border border-gray-200 placeholder:text-sm font-normal rounded-md p-2"
                    placeholder="Full Address"
                  ></textarea>
                </div>

                <div className="flex justify-end p-3">
                  <button
                    type="submit"
                    className="py-3 px-4 rounded-md bg-blue-900 hover:bg-blue-800 duration-200 text-white"
                  >
                    {loading ? 'Placing Order' : 'Place Order Now'}
                  </button>
                </div>
              </form>

              <div className="flex-1 bg-white rounded-md p-4">
                <div className="max-w-[90vw] mx-auto overflow-auto">
                  <table className="w-full">
                    <thead className="bg-blue-300">
                      <tr>
                        <th className="rounded-tl-md font-medium p-[10px] text-start">Product</th>
                        <th className="font-medium p-[10px] text-start">Price</th>
                        <th className="font-medium p-[10px] text-start">Quantity</th>
                        <th className="font-medium p-[10px] text-start rounded-tr-md">Total</th>
                      </tr>
                    </thead>
                    <tbody className="w-full">
                      {items.length > 0 &&
                        items.map((item, index) => {
                          total += item.productPrice * item.quantity;

                          return (
                            <tr className="px-2 border text-gray-500 bg-slate-100" key={index}>
                              <td className="pl-2 py-2 font-medium text-[14px] truncate">
                                {item.productName.slice(0, 20)}...
                              </td>
                              <td className="py-3 font-medium w-[20%]">
                                <p className="pl-2 flex items-center">
                                  <FaNairaSign />
                                  {item.productPrice.toLocaleString()}.00
                                </p>
                              </td>
                              <td className="py-2 font-medium">
                                <div className="pl-3 h-full gap-2">
                                  <span>{item.quantity}</span>
                                </div>
                              </td>
                              <td className="py-3 font-medium w-[20%]">
                                <p className="pl-2 flex items-center">
                                  <FaNairaSign />
                                  {(item.productPrice * item.quantity).toLocaleString()}.00
                                </p>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <div className="font-medium py-2 grid grid-cols-2 border items-center w-full">
                    <p className="text-xl px-2">Grand Total</p>
                    <p className="flex justify-end px-2 items-center w-full">
                      <FaNairaSign />
                      {total.toLocaleString()}.00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}