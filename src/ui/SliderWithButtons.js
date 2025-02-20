import React from "react";
import "../SliderWithButtons.css";

function SliderWithButtons({ value, min, max, step, onChange }) {
    const handleIncrement = () => {
        onChange(Math.min(value + step, max));
    };
    const handleDecrement = () => {
        onChange(Math.max(value - step, min));
    };

    return (
        <div className="slider-with-buttons">
            <button onClick={handleDecrement} className="slider-button">
                &minus;
            </button>
            <input
                type="range"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={e => onChange(Number(e.target.value))}
                className="slider"
            />
            <button onClick={handleIncrement} className="slider-button">
                &#43;
            </button>
            <span className="slider-value">{value}%</span>
        </div>
    );
}

export default SliderWithButtons;
