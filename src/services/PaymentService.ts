import api from "@/services/interceptors/interceptors";

export const PaymentService = {
  check (paymentUid: string) {
    // let encodedPaymentUid = encodeURIComponent(paymentUid);
    return api.get(`/payment/check`, {
      params: {
        paymentUid,
      },
    });
  },
};
