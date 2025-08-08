const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ===================== KODE UNTUK TES DIAGNOSTIK =====================
// Ganti fungsi registerUser Anda dengan yang ini UNTUK SEMENTARA
exports.registerUser = async (req, res) => {
  // Jika Anda melihat log ini di terminal Railway, berarti rute & controller BEKERJA.
  console.log("✅ FUNGSI registerUser BERHASIL DIPANGGIL!");
  console.log("Body request yang diterima:", req.body);

  // Langsung kirim respons sukses tanpa menyentuh database
  return res.status(200).json({
    message: "Tes endpoint register berhasil!",
    dataDiterima: req.body,
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validasi input
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password tidak cocok" });
    }

    // Cek apakah email sudah terdaftar di Supabase Auth
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (checkError === null && existingUsers) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    // Daftarkan ke Supabase Auth (admin API)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Simpan username dan default image di tabel users
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: data.user.id,
        email,
        username,
        image: "https://cdn-icons-png.flaticon.com/512/847/847969.png", // default avatar
      },
    ]);

    if (insertError) {
      // Jika gagal insert, hapus user di auth supaya tidak ada data setengah jadi
      await supabase.auth.admin.deleteUser(data.user.id);
      return res.status(500).json({ error: insertError.message });
    }

    return res
      .status(201)
      .json({ message: "Registrasi berhasil", userId: data.user.id });
  } catch (error) {
    console.error("Error registerUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: "Email/Username dan password wajib diisi" });
    }

    let emailToLogin = identifier;

    // Jika identifier bukan email, cari email berdasarkan username
    if (!identifier.includes("@")) {
      const { data: userResult, error } = await supabase
        .from("users")
        .select("email")
        .eq("username", identifier)
        .single();

      if (error || !userResult) {
        return res.status(400).json({ error: "Username tidak ditemukan" });
      }

      emailToLogin = userResult.email;
    }

    // Login ke Supabase Auth
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: emailToLogin,
      password,
    });

    if (loginError) {
      return res.status(401).json({ error: "Email/Password salah" });
    }

    // Ambil profil tambahan (username dan image) dari tabel users
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("username, image")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(500).json({ error: "Gagal ambil profil user" });
    }

    // Gabungkan data user dengan tambahan username dan image
    const user = {
      id: data.user.id,
      email: data.user.email,
      username: profile.username,
      image:
        profile.image ||
        "https://cdn-icons-png.flaticon.com/512/847/847969.png", // default avatar jika kosong
    };

    return res.json({
      message: "Login berhasil",
      access_token: data.session.access_token,
      user,
    });
  } catch (error) {
    console.error("Error loginUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
