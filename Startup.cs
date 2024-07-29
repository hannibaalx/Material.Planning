using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Material.Planning
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        //readonly string MPAllowSpecificOrigins = "http://QJ07301264, http://QJ08085879, http://localhost,http://localhost:64849, https://localhost:44346, http://localhost:4200, https://localhost:5001, http://localhost:5000";

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            // Make sure you call this previous to AddMvc
            services.AddCors();
            //services.AddCors(options =>
            //{
            //    options.AddPolicy(MPAllowSpecificOrigins,
            //    builder =>
            //    {
            //        builder.WithOrigins("http://QJ07301264",
            //            "http://QJ08085879",
            //            "http://localhost",
            //            "http://localhost:64849",
            //            "https://localhost:44346",
            //            "http://localhost:4200",
            //            "https://localhost:5001",
            //            "http://localhost:5000");
            //    });
            //});

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseDeveloperExceptionPage();
                //app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            //app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = context =>
                {
                    if (context.File.Name == "index.html")
                    {
                        context.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate, pre-check=0, post-check=0, max-age=0, s-maxage=0");
                        context.Context.Response.Headers.Add("Expires", "-1");
                    }
                }
            });

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            // Make sure you call this before calling app.UseMvc()
            //builder.WithOrigins(MPAllowSpecificOrigins));   //options => options.WithOrigins(MPAllowSpecificOrigins)
            app.UseCors(builder =>
                builder.WithOrigins("https://im.maverick.aa.com",
                        "https://im-np.maverick.aa.com",
                        "http://QXD07000990",
                        "http://QJ07301264",
                        "http://QJ08085879",
                        "http://localhost",
                        "http://localhost:64849",
                        "https://localhost:44346",
                        "http://localhost:4200",
                        "https://localhost:4200",
                        "https://localhost:5001",
                        "http://localhost:5000").AllowAnyMethod()
                                                                    .AllowAnyHeader()
                                                                    .AllowAnyOrigin()
                );
                //.WithOrigins("http://QJ07301264",
                //        "http://QJ08085879",
                //        "http://localhost:64849",
                //        "https://localhost:44346",
                //        "http://localhost:4200",
                //        "https://localhost:4200",
                //        "https://localhost:5001",
                //        "http://localhost:5000",
                //        "http://localhost")
                //    .AllowAnyMethod()
                //    .AllowAnyHeader()
                //    .AllowCredentials().SetIsOriginAllowedToAllowWildcardSubdomains()
                //);

            app.UseRouting();    

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
