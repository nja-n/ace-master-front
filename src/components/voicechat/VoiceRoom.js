// VoiceRoom.js
import React, { useEffect, useRef, useState } from "react";
import { voiceRoom } from "../methods";

export default function VoiceRoom({ roomId, userId }) {
  const wsRef = useRef(null);
  const peersRef = useRef({});
  const localStreamRef = useRef(null);
  const audioContainerRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(voiceRoom);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", roomId, userId }));
    };
    ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);
      const { type, from, sdp, candidate } = data;

      if (from === userId) return;

      if (type === "offer") {
        const pc = await ensurePeer(from);
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: "answer", roomId, from: userId, to: from, sdp: answer }));
      }

      if (type === "answer") {
        const pc = peersRef.current[from];
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }

      if (type === "candidate") {
        const pc = peersRef.current[from];
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    wsRef.current = ws;

    return () => {
      Object.values(peersRef.current).forEach(pc => pc.close());
      ws.close();
    };
  }, [roomId, userId]);

  async function ensurePeer(peerId) {
    if (peersRef.current[peerId]) return peersRef.current[peerId];

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    // local stream
    if (!localStreamRef.current) {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));

    // ICE candidates
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        wsRef.current.send(JSON.stringify({
          type: "candidate", roomId, from: userId, to: peerId, candidate: e.candidate
        }));
      }
    };

    // remote audio
    pc.ontrack = (e) => {
      const audio = document.createElement("audio");
      audio.srcObject = e.streams[0];
      audio.autoplay = true;
      audioContainerRef.current.appendChild(audio);
    };

    peersRef.current[peerId] = pc;
    return pc;
  }

  async function callPeer(peerId) {
    const pc = await ensurePeer(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    wsRef.current.send(JSON.stringify({ type: "offer", roomId, from: userId, to: peerId, sdp: offer }));
  }

  return (
    <div>
      <div ref={audioContainerRef}></div>
      <button onClick={() => Object.keys(peersRef.current).forEach(callPeer)}>Start Voice</button>
    </div>
  );
}
