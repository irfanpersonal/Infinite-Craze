const RegisterBox: React.FunctionComponent = () => {
    return (
        <>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" name="name" required/>
            </div>
            <div>
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" name="email" required/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" required/>
            </div>
            <div>
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input id="dateOfBirth" type="date" name="dateOfBirth" required/>
            </div>
            <div>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input id="phoneNumber" type="tel" name="phoneNumber" required/>
            </div>
        </>
    );
}

export default RegisterBox;