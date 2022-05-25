import logo from '../logo.svg';
import React, { useState } from "react";
import "./Home.css";
import DragMove from '../component/DragMove';

const Home = () => {
    const [translate, setTranslate] = useState({
        x: 0,
        y: 0
    });

    const handleDragMove = (e) => {
        setTranslate({
            x: translate.x + e.movementX,
            y: translate.y + e.movementY
        });
    };
    return (
        <div className="Home">
                <DragMove onDragMove={handleDragMove}>
                    <div
                        style={{
                            transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
                        }}
                    >
                        <img src={logo} className="Home-logo" alt="logo" />
                    </div>
                </DragMove>
        </div>
    )
};

export default Home;