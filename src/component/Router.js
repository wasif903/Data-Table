import { Routes, Route, Link } from "react-router-dom";
import Main from "./Main";
import SignIn from "./Login";
import Protected from "./Protected";
import { Component } from "react";

export const Router = () => {

    return (
        <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/main" element={<Protected Component = {Main} />} />
        

        {/* <Route path="about" element={<About />} /> */}
      </Routes>
    )
}