import React from 'react';

export default function Loading() {
  return (
    <section style={{padding: 300}}>

      <div className="wrapper">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-6"></div>
        <div className="circle circle-7"></div>
        <div className="circle circle-8"></div>
      </div>

      <style jsx>{`
        body {
          padding: 0;
          margin: 0;
          background-color: #fcdc29;
          text-align: center;
          height: 100vh;
          font-family: 'Lato', sans-serif;
          font-weight: 100;
        }
        .wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .circle {
          display: inline-block;
          width: 15px;
          height: 15px;
          background-color: #fcdc29;
          border-radius: 50%;
          animation: loading 1.5s cubic-bezier(.8, .5, .2, 1.4) infinite;
          transform-origin: bottom center;
          position: relative;
        }
        @keyframes loading {
          0% {
            transform: translateY(0px);
            background-color: #fcdc29;
          }
          50% {
            transform: translateY(50px);
            background-color: #ef584a;
          }
          100% {
            transform: translateY(0px);
            background-color: #fcdc29;
          }
        }
        .circle-1 {
          animation-delay: 0.1s;
        }
        .circle-2 {
          animation-delay: 0.2s;
        }
        .circle-3 {
          animation-delay: 0.3s;
        }
        .circle-4 {
          animation-delay: 0.4s;
        }
        .circle-5 {
          animation-delay: 0.5s;
        }
        .circle-6 {
          animation-delay: 0.6s;
        }
        .circle-7 {
          animation-delay: 0.7s;
        }
        .circle-8 {
          animation-delay: 0.8s;
        }
      `}</style>
    </section>
  );
}
