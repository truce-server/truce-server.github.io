import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

const GlitchEffect = ({ imageUrl, width, height, isHovered, onClick }) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const imgRef = useRef(null);
  const timelineRef = useRef(null);

  const randomIntFromInterval = (min, max) => {
    return Math.random() * (max - min + 1) + min;
  };

  const animateGlitch = () => {
    if (!imgRef.current || !isHovered) return;

    const img = imgRef.current;
    
    const tl = gsap.timeline({
      delay: randomIntFromInterval(0, 1),
      onComplete: () => {
        if (isHovered) {
          animateGlitch();
        }
      }
    });

    // Red channel glitch
    tl.to(img.filters[0].red, {
      duration: 0.2,
      x: randomIntFromInterval(-15, 15),
      y: randomIntFromInterval(-15, 15)
    });
    tl.to(img.filters[0].red, {
      duration: 0.01,
      x: 0,
      y: 0
    });

    // Blue channel glitch with slice effect
    tl.to(img.filters[0].blue, {
      duration: 0.2,
      x: randomIntFromInterval(-15, 15),
      y: 0,
      onComplete() {
        if (img.filters[1]) {
          img.filters[1].slices = 20;
          img.filters[1].direction = randomIntFromInterval(-75, 75);
        }
      }
    }, '-=0.2');

    tl.to(img.filters[0].blue, {
      duration: 0.1,
      x: randomIntFromInterval(-15, 15),
      y: randomIntFromInterval(-5, 5),
      onComplete() {
        if (img.filters[1]) {
          img.filters[1].slices = 12;
          img.filters[1].direction = randomIntFromInterval(-75, 75);
        }
      }
    });

    tl.to(img.filters[0].blue, {
      duration: 0.01,
      x: 0,
      y: 0,
      onComplete() {
        if (img.filters[1]) {
          img.filters[1].slices = 0;
          img.filters[1].direction = 0;
        }
      }
    });

    // Green channel glitch
    tl.to(img.filters[0].green, {
      duration: 0.2,
      x: randomIntFromInterval(-15, 15),
      y: 0
    }, '-=0.2');

    tl.to(img.filters[0].green, {
      duration: 0.1,
      x: randomIntFromInterval(-20, 20),
      y: randomIntFromInterval(-15, 15)
    });

    tl.to(img.filters[0].green, {
      duration: 0.01,
      x: 0,
      y: 0
    });

    tl.timeScale(1.2);
    timelineRef.current = tl;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create PIXI application
    const app = new PIXI.Application({
      view: canvasRef.current,
      width: width,
      height: height,
      transparent: true,
      backgroundAlpha: 0
    });
    appRef.current = app;

    // Load and setup image
    const texture = PIXI.Texture.from(imageUrl);
    const img = new PIXI.Sprite(texture);
    
    // Center and size the image
    img.width = width;
    img.height = height;
    img.x = app.screen.width / 2;
    img.y = app.screen.height / 2;
    img.anchor.x = 0.5;
    img.anchor.y = 0.5;

    // Add filters
    const rgbSplitFilter = new PIXI.filters.ColorMatrixFilter();
    const glitchFilter = new PIXI.filters.NoiseFilter();
    
    // Create custom RGB split effect
    const rgbFilter = {
      red: { x: 0, y: 0 },
      green: { x: 0, y: 0 },
      blue: { x: 0, y: 0 }
    };

    // Custom glitch filter setup
    const customGlitchFilter = {
      slices: 0,
      offset: 20,
      direction: 0
    };

    img.filters = [rgbFilter, customGlitchFilter];
    imgRef.current = img;

    app.stage.addChild(img);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [imageUrl, width, height]);

  useEffect(() => {
    if (isHovered && imgRef.current) {
      animateGlitch();
    } else if (timelineRef.current) {
      timelineRef.current.kill();
      // Reset all filters
      if (imgRef.current && imgRef.current.filters) {
        imgRef.current.filters[0].red = { x: 0, y: 0 };
        imgRef.current.filters[0].green = { x: 0, y: 0 };
        imgRef.current.filters[0].blue = { x: 0, y: 0 };
        if (imgRef.current.filters[1]) {
          imgRef.current.filters[1].slices = 0;
          imgRef.current.filters[1].direction = 0;
        }
      }
    }
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'block',
        filter: 'drop-shadow(0 8px 20px rgba(212, 175, 55, 0.3))',
        transition: 'filter 0.3s ease',
      }}
    />
  );
};

export default GlitchEffect;
