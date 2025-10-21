import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Box, Button, Dialog, DialogContent, DialogActions, Typography } from "@mui/material";
import { getCroppedImg } from "../../Utiliy";
import { uploadImage } from "../../methods";
import { apiClient } from "../../utils/ApIClient";
import { useLoading } from "../../LoadingContext";
import { emit } from "../eventBus";

const ProfileImageUpload = ({ onUpload }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [open, setOpen] = useState(false);
  const {setLoading} = useLoading();

  // handle file select
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", croppedBlob, "avatar.jpg");

      // send to backend (Spring Boot -> Firebase)
      await apiClient(uploadImage, {
        method: "POST",
        body: formData,
        contentType: null,
      });

      setOpen(false);
      onUpload && onUpload(false);
      emit("user:refresh"); // refresh user data
      alert("Profile image updated successfully!");
    } catch (err) {
      alert("Failed to crop the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="contained" component="label" color="gold">
        Update
        <input hidden type="file" accept="image/*" onChange={onFileChange} />
      </Typography>

      <Dialog open={open} onClose={() => setOpen(false)} 
        maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #0f172a, #1e293b)", // Dark gradient background
          color: "white",
        },
      }}>
        <DialogContent sx={{ position: "relative", height: 400 }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </DialogContent>
        <DialogActions>
            <Button
                    onClick={() => setOpen(false)}
                    variant="determinate"
                    color="info"
                    sx={{
                      border: "2px solid #FFD700",
                      color: "#FFD700",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      boxShadow:
                        "inset 0 1px 3px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)",
                      textShadow: "1px 1px 2px #000",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 0 10px #FFD700",
                      },
                    }}
                  >
                    Cancel
                  </Button>
          <Button
                    onClick={handleSave}
                    variant="outlined"
                    color="info"
                    sx={{
                      border: "2px solid #FFD700",
                      color: "#FFD700",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      boxShadow:
                        "inset 0 1px 3px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)",
                      textShadow: "1px 1px 2px #000",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 0 10px #FFD700",
                      },
                    }}
                  >
                    Save
                  </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileImageUpload;
