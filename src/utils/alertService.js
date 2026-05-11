import Swal from "sweetalert2";

/* ======================================================
   BASE SAAS CONFIG
====================================================== */

const SwalSaaS = Swal.mixin({
  background: "#ffffff",
  color: "#1f2937",
  backdrop: "rgba(0,0,0,0.35)",
  buttonsStyling: false,
  customClass: {
    container: "saas-container",
    popup: "saas-popup",
    title: "saas-title",
    confirmButton: "saas-confirm-btn",
    cancelButton: "saas-cancel-btn",
  },
});

/* ======================================================
   STANDARD ALERT
====================================================== */

export const showAlert = ({
  icon = "info",
  title = "",
  text = "",
  timer = null,
}) => {
  return SwalSaaS.fire({
    icon,
    title,
    text,
    timer,
    timerProgressBar: !!timer,
    showConfirmButton: !timer,
  });
};

/* ======================================================
   TOAST ALERT
====================================================== */

export const showToast = ({
  icon = "success",
  title = "",
  timer = 2000,
}) => {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    background: "#1f2937",
    color: "#ffffff",
  });
};

/* ======================================================
   CONFIRM DIALOG
====================================================== */

export const showConfirm = ({
  title = "Are you sure?",
  text = "",
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return SwalSaaS.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

/* ======================================================
   LOADING
====================================================== */

export const showLoading = (title = "Processing...") => {
  return SwalSaaS.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/* ======================================================
   CLOSE
====================================================== */

export const closeAlert = () => {
  Swal.close();
};
