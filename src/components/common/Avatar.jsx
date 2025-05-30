
const Avatar = ({photoURL, displayName, className}) => {
    return (
        <div className="avatar avatar-online ">
                <div className={` rounded-full ${className}`}>
                  <img src={photoURL} alt={displayName}/>
                </div>
        </div>
    );
};

export default Avatar;