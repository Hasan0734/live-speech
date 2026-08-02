import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface PropsType {
  isCameraActive: boolean;
  cameraStream: MediaStream | null;
  socket: Socket;
}

const MARGIN = 16;

export default function VideoPreview({
  isCameraActive,
  cameraStream,
  socket,
}: PropsType) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef({
    dragging: false,

    pointerStartX: 0,
    pointerStartY: 0,

    startLeft: 0,
    startTop: 0,

    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
       
      // if(isCameraActive) {
      //    captureFrame();
      // }

    }
  }, [cameraStream]);



  const captureFrame = () => {
    const video = videoRef.current!;

    if (!video) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = 640;
    canvas.height = 480;

    setInterval(() => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];

      socket.emit("user:video", {
        mimeType: "image/jpeg",
        data: base64,
      });
    }, 200);
  };

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const width = el.offsetWidth;
    const height = el.offsetHeight;

    el.style.left = `${window.innerWidth - width - MARGIN}px`;
    el.style.top = `${window.innerHeight - height - MARGIN}px`;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const el = containerRef.current;
      if (!el) return;

      const width = el.offsetWidth;
      const height = el.offsetHeight;

      let left = parseFloat(el.style.left || "0");
      let top = parseFloat(el.style.top || "0");

      left = Math.min(left, window.innerWidth - width - MARGIN);
      top = Math.min(top, window.innerHeight - height - MARGIN);

      left = Math.max(MARGIN, left);
      top = Math.max(MARGIN, top);

      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    dragRef.current.dragging = true;

    dragRef.current.pointerStartX = e.clientX;
    dragRef.current.pointerStartY = e.clientY;

    dragRef.current.startLeft = parseFloat(el.style.left || "0");
    dragRef.current.startTop = parseFloat(el.style.top || "0");

    dragRef.current.width = el.offsetWidth;
    dragRef.current.height = el.offsetHeight;

    el.setPointerCapture(e.pointerId);

    const handlePointerMove = (ev: PointerEvent) => {
      if (!dragRef.current.dragging) return;

      const dx = ev.clientX - dragRef.current.pointerStartX;
      const dy = ev.clientY - dragRef.current.pointerStartY;

      let left = dragRef.current.startLeft + dx;
      let top = dragRef.current.startTop + dy;

      // Clamp horizontally
      left = Math.max(
        MARGIN,
        Math.min(left, window.innerWidth - dragRef.current.width - MARGIN),
      );

      // Clamp vertically
      top = Math.max(
        MARGIN,
        Math.min(top, window.innerHeight - dragRef.current.height - MARGIN),
      );

      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    };

    const handlePointerUp = () => {
      dragRef.current.dragging = false;

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  if (!isCameraActive) return null;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={cn(
        "fixed",
        "z-50",
        "w-72",
        "cursor-grab",
        "select-none",
        "touch-none",
        "active:cursor-grabbing",
      )}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="h-full w-full rounded-xl object-cover shadow-xl"
      />
    </div>
  );
}
