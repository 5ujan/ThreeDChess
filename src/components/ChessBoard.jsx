// ChessBoard.jsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ChessBoard = ({ scene }) => {
  const board = useRef(null);

  useEffect(() => {
    if (!scene) return;

    const square = new THREE.BoxGeometry(1, 0.1, 1);
    // const textureLoader = new THREE.TextureLoader();
    // const lightWoodTexture = textureLoader.load("/light_wood.png"); // Replace with your path
    // const darkWoodTexture = textureLoader.load("/dark_wood.png"); // Replace with your path

    // const lightsquare = new THREE.MeshStandardMaterial({
    //   map: lightWoodTexture,
    // });
    // const darksquare = new THREE.MeshStandardMaterial({ map: darkWoodTexture });
    // board.current = new THREE.Group();

    const lightsquare = new THREE.MeshBasicMaterial({ color: 0xe0c4a8 });
    const darksquare = new THREE.MeshBasicMaterial({ color: 0x6a4236 });

    board.current = new THREE.Group();

    let squareNumber = 1;
    for (let x = 0; x < 8; x++) {
      for (let z = 0; z < 8; z++) {
        let cube;
        const posX = x - 3.5;
        const posZ = z - 3.5;
        if (z % 2 === 0) {
          cube = new THREE.Mesh(square, x % 2 === 0 ? lightsquare : darksquare);
          if (x % 2 !== 0) {
            cube.userData.squareNumber = squareNumber;
            squareNumber++;
          }
        } else {
          cube = new THREE.Mesh(square, x % 2 === 0 ? darksquare : lightsquare);
          if (x % 2 === 0) {
            cube.userData.squareNumber = squareNumber;
            squareNumber++;
          }
        }

        cube.position.set(posX, 0, posZ);
        board.current.add(cube);
      }
    }

    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    // scene.add(ambientLight);

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Bright white light
    // directionalLight.position.set(5, 10, 7.5);
    // scene.add(directionalLight);

    // const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Intensity, Distance
    // pointLight.position.set(0, 10, 0);
    // scene.add(pointLight);

    scene.add(board.current);

    return () => {
      scene.remove(board.current);
      board.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
    };
  }, [scene]);

  return null;
};

export default ChessBoard;
