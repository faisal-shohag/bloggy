import { use, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false)
  const { user, updateUserProfile } = use(AuthContext);
  
  const handleUpdateProfile = (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const photoURL = e.target.photoURL.value

    updateUserProfile(name, photoURL)
  }

  return (
    <div className="mx-auto w-full text-center">
      <div className="avatar w-full">
        <div className="w-24 rounded-full mx-auto">
          <img className="w-24 h-24" src={user.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
        </div>
      </div>
      <h2 className="mt-2 font-black text-2xl">{user.displayName || 'Unknown'}</h2>
      <h2 className="mt-2 font-black text-xl">{user.email || 'Unknown'}</h2>
     <button onClick={()=> setIsEdit(!isEdit)} className="btn btn-xs mt-5">Edit</button>
   
   
  { isEdit &&  <div className="flex  border-t border-dashed border-t-gray-500 py-5 mt-5 w-full justify-center flex-col items-center">
    <h1 className="text-xl font-semibold">Edit Profile</h1>
   <form onSubmit={handleUpdateProfile}>
        <fieldset className="fieldset w-[300px]">
          <label className="label">Name</label>
          <input defaultValue={user?.displayName} type="text" name="name" className="input" placeholder="Name"/>
          <label className="label">PhotoURL</label>
          <input defaultValue={user?.photoURL} type="text" name="photoURL" className="input" placeholder="PhotoURL"/>

          <button className="btn btn-xs  mt-3">Save</button>
        </fieldset>
      </form>
   </div>}
    
    </div>
  );
};

export default Profile;
