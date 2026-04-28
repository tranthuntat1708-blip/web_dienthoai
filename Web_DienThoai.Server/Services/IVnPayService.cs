namespace Web_NoiThat.Server.Services;

public interface IVnPayService
{
    /// <summary>Tạo VNPay payment URL với HMAC SHA-512</summary>
    string CreatePaymentUrl(string orderCode, decimal amount, string orderInfo, string ipAddress);

    /// <summary>Verify IPN callback signature từ VNPay</summary>
    bool ValidateIpnSignature(IQueryCollection query);
}
