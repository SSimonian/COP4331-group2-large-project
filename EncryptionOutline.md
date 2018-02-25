Prerequisites:

  The Dead Man’s Switch service has private key “**DPriv**” & public key “**DPub**"
  
  The Uploader has private key “**UPriv**” & public key “**UPub**”
  The Recipient has private key “**RPriv**” & public key “**RPub**”


Uploader (client side):

  Uploader starts with a file “**Original**” they want to encrypt & upload.
  Get signature hash “**HF**" for **Original** using SHA-256 (**Original** doesn’t change).
  Encrypt **Original** with **UPriv** then again with **RPub**.
  (This encrypted version of the data can be decrypted by the recipient alone and no one else.)
  Append signature **HF** to the encrypted file. Let’s call the result “**ES**" (encrypted file + signature **HF**)
  Now get signature hash “**HE**” for **ES** using SHA-256 (**ES** doesn’t change).
  Uploader then takes **ES** (encrypted file + signature **HF**), and encrypts the whole thing with **UPriv** then again with **DPub**.
  Append signature **HE** to the resulting encrypted data. Let’s call this result “**Final**” (encrypted data + signature **HE**).

  *The first hash signature is probably unnecessary. The second hash is necessary 
  since we can only see encrypted data that looks no different from modified garbage data.


Transit:

  Uploader sends the **Final** data to the Dead Man’s Switch server.
  **Final** has 4 layers of encryption and signatures, so there’s minimal vulnerability if it is intercepted.


Dead Man’s Switch service (server side):

  Server receives **Final** data and needs to check if it was compromised in transit.
    
    (This is why we added the second layer of public/private key encryption & hashing.
    Since we can’t view the unencrypted file to check for compromise, we can check the second layer instead.
    Wouldn’t it suck if we stored someone’s vital documents for years then released them when the person died, 
    only for the recipient to decrypt it and find out that we never even received the correct data that
    the client tried to upload?)
        
  Remove the signature bits at the end of **Final** and store this as signature “**HE**”.
  Decrypt **Final** (now without the signature) using **DPriv** then again with **UPub**. Call the result “**ES**”.
  Calculate the hash of **ES**, and make sure it’s the same as the signature **HE**. If so, continue, if not, the data was compromised.
  Keep **ES** stored on the server until the uploader wants it removed or it needs to be sent out.
  Have a timer count down, and if it hits 0 then initiate the dead man’s switch. 
  Timer resets when the uploader checks in, or it can skip to 0 and initiate the switch immediately if the uploader hits a panic button.
  When the switch activates, send the **ES** file to the recipient.


Transit:

  Server sends the encrypted **ES** file to recipient
  **ES** has 2 layers of encryption so there is little vulnerability of an intercepter reading the file.


Recipient Side (client side):

  Recipient receives encrypted **ES** file, remove the signature bits at the end of **ES** and store this as signature “**HF**”.
  Decrypt the file (now without the signature) using **RPriv** then again with **UPub**. This results in the "**Original**"" file.
  Calculate the hash of the **Original** file and compare it to the signature **HF**.
  Recipient now has the **Original** file from uploader, and the server never had a way of knowing what the file contained.
