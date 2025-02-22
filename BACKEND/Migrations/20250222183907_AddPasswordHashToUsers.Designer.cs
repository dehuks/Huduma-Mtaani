﻿// <auto-generated />
using System;
using BACKEND.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BACKEND.Migrations
{
    [DbContext(typeof(HudumaDbContext))]
    [Migration("20250222183907_AddPasswordHashToUsers")]
    partial class AddPasswordHashToUsers
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("BACKEND.Models.Address", b =>
                {
                    b.Property<int>("AddressId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("AddressId"));

                    b.Property<string>("BuildingName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("County")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Street")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("AddressId");

                    b.ToTable("Addresses");
                });

            modelBuilder.Entity("BACKEND.Models.Admin", b =>
                {
                    b.Property<int>("AdminId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("AdminId"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("AdminId");

                    b.ToTable("Admins");
                });

            modelBuilder.Entity("BACKEND.Models.Customer", b =>
                {
                    b.Property<int>("CustomerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("CustomerId"));

                    b.Property<int?>("AddressId")
                        .HasColumnType("integer");

                    b.Property<string>("CustomerName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("CustomerId");

                    b.HasIndex("AddressId");

                    b.ToTable("Customers");
                });

            modelBuilder.Entity("BACKEND.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("OrderId"));

                    b.Property<decimal>("Amount")
                        .HasColumnType("decimal(10,2)");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("CustomerId")
                        .HasColumnType("integer");

                    b.Property<int?>("ServiceProviderId")
                        .HasColumnType("integer");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("OrderId");

                    b.HasIndex("CustomerId");

                    b.HasIndex("ServiceProviderId");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("BACKEND.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PaymentId"));

                    b.Property<int?>("OrderId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("PaymentDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("PaymentId");

                    b.HasIndex("OrderId");

                    b.ToTable("Payments");
                });

            modelBuilder.Entity("BACKEND.Models.Rating", b =>
                {
                    b.Property<int>("RatingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("RatingId"));

                    b.Property<int?>("CustomerId")
                        .HasColumnType("integer");

                    b.Property<int>("Rate")
                        .HasColumnType("integer");

                    b.HasKey("RatingId");

                    b.HasIndex("CustomerId");

                    b.ToTable("Ratings");
                });

            modelBuilder.Entity("BACKEND.Models.Service", b =>
                {
                    b.Property<int>("ServiceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ServiceId"));

                    b.Property<string>("ServiceDescription")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ServiceName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ServiceId");

                    b.ToTable("Services");
                });

            modelBuilder.Entity("BACKEND.Models.ServiceProvider", b =>
                {
                    b.Property<int>("ServiceProviderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ServiceProviderId"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("RatingId")
                        .HasColumnType("integer");

                    b.Property<int?>("ServiceId")
                        .HasColumnType("integer");

                    b.HasKey("ServiceProviderId");

                    b.HasIndex("RatingId");

                    b.HasIndex("ServiceId");

                    b.ToTable("ServiceProviders");
                });

            modelBuilder.Entity("BACKEND.Models.Customer", b =>
                {
                    b.HasOne("BACKEND.Models.Address", "Address")
                        .WithMany()
                        .HasForeignKey("AddressId");

                    b.Navigation("Address");
                });

            modelBuilder.Entity("BACKEND.Models.Order", b =>
                {
                    b.HasOne("BACKEND.Models.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId");

                    b.HasOne("BACKEND.Models.ServiceProvider", "ServiceProvider")
                        .WithMany()
                        .HasForeignKey("ServiceProviderId");

                    b.Navigation("Customer");

                    b.Navigation("ServiceProvider");
                });

            modelBuilder.Entity("BACKEND.Models.Payment", b =>
                {
                    b.HasOne("BACKEND.Models.Order", "Order")
                        .WithMany()
                        .HasForeignKey("OrderId");

                    b.Navigation("Order");
                });

            modelBuilder.Entity("BACKEND.Models.Rating", b =>
                {
                    b.HasOne("BACKEND.Models.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId");

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("BACKEND.Models.ServiceProvider", b =>
                {
                    b.HasOne("BACKEND.Models.Rating", "Rating")
                        .WithMany()
                        .HasForeignKey("RatingId");

                    b.HasOne("BACKEND.Models.Service", "Service")
                        .WithMany()
                        .HasForeignKey("ServiceId");

                    b.Navigation("Rating");

                    b.Navigation("Service");
                });
#pragma warning restore 612, 618
        }
    }
}
