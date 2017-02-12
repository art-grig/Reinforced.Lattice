using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Mvc.Models.Tutorial;
using PowerTables.Plugins.Hierarchy;

namespace PowerTables.Mvc.Controllers
{
    public partial class TutorialController
    {
        [Tutorial("Filesystem")]
        public ActionResult Filesystem()
        {
            var t = new Configurator<FileSystemInfo, FileRow>().Filesystem().Url(Url.Action("FilesystemHandle"));
            return View("BaseTutorial", t);
        }

        public ActionResult FilesystemHandle()
        {
            var di = new DirectoryInfo(@"C:\\Program Files (x86)");
            var infos = di.EnumerateFileSystemInfos().Where(c => (c.Attributes & FileAttributes.Hidden) != FileAttributes.Hidden);
            var t = new Configurator<FileSystemInfo, FileRow>().Filesystem();
            var handler = t.CreateMvcHandler(ControllerContext);
            handler.AddChildrenHandler(Children);
            return handler.Handle(infos.AsQueryable());
        }

        private IEnumerable<FileSystemInfo> Children(LatticeData<FileSystemInfo, FileRow> latticeData, FileRow fileRow)
        {
            var di = new DirectoryInfo(fileRow.FullPath);
            return di.EnumerateFileSystemInfos().Where(c => (c.Attributes & FileAttributes.Hidden) != FileAttributes.Hidden);
        }

        public ActionResult FileIcon(string path)
        {
            return File(Icon.FileIcon, "image/png");
        }

        public ActionResult DirIcon(string path)
        {
            return File(Icon.DirIcon, "image/png");
        }

        public ActionResult GetIcon(string path)
        {
            return File(Icon.GetIcon(path), "image/png");
        }

    }

    class Icon
    {
        public static byte[] FileIcon { get; private set; }
        public static byte[] DirIcon { get; private set; }

        public static Dictionary<string, byte[]> CachedIcons = new Dictionary<string, byte[]>();

        public static byte[] GetIcon(string path)
        {
            var ex = Path.GetExtension(path);
            var dir = new DirectoryInfo(path);
            if (dir.Exists) return DirIcon;
            if (string.IsNullOrEmpty(ex))
            {
                return FileIcon;
            }
            if (CachedIcons.ContainsKey(ex)) return CachedIcons[ex];

            SHFILEINFO shinfo = new SHFILEINFO();
            Win32.SHGetFileInfo(path, 0, ref shinfo, (uint)Marshal.SizeOf(shinfo), Win32.SHGFI_ICON | Win32.SHGFI_SMALLICON); ;
            System.Drawing.Icon fileIcon = System.Drawing.Icon.FromHandle(shinfo.hIcon);
            var icon = ToPngBytes(fileIcon);
            if (ex != ".exe") CachedIcons[ex] = icon;
            return icon;
        }

        static Icon()
        {
            SHFILEINFO shinfo = new SHFILEINFO();
            Win32.SHGetFileInfo("D:\\file", 0, ref shinfo, (uint)Marshal.SizeOf(shinfo), Win32.SHGFI_ICON | Win32.SHGFI_SMALLICON); ;
            System.Drawing.Icon fileIcon = System.Drawing.Icon.FromHandle(shinfo.hIcon);
            FileIcon = ToPngBytes(fileIcon);

            Win32.SHGetFileInfo("C:\\Windows", 0, ref shinfo, (uint)Marshal.SizeOf(shinfo), Win32.SHGFI_ICON | Win32.SHGFI_SMALLICON); ;
            System.Drawing.Icon dirIcon = System.Drawing.Icon.FromHandle(shinfo.hIcon);
            DirIcon = ToPngBytes(dirIcon);
        }

        static byte[] ToPngBytes(System.Drawing.Icon icon)
        {
            using (var icn = icon.ToBitmap())
            {
                using (var ms = new MemoryStream())
                {
                    icn.Save(ms, ImageFormat.Png);
                    return ms.ToArray();
                }
            }
        }
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct SHFILEINFO
    {
        public IntPtr hIcon;
        public int iIcon;
        public uint dwAttributes;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 260)]
        public string szDisplayName;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 80)]
        public string szTypeName;
    };

    class Win32
    {
        public const uint SHGFI_ICON = 0x100;
        public const uint SHGFI_LARGEICON = 0x0; // 'Large icon
        public const uint SHGFI_SMALLICON = 0x1; // 'Small icon

        [DllImport("shell32.dll")]
        public static extern IntPtr SHGetFileInfo(string pszPath, uint dwFileAttributes, ref SHFILEINFO psfi, uint cbSizeFileInfo, uint uFlags);
    }


}