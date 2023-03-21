// Copyright (c) 2023, Talib Sheikh and contributors
// For license information, please see license.txt

frappe.ui.form.on("Performance Appraisal", {
  before_save: function (frm) {
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.appraiser_user_id) {
      if (frm.doc.appraiser_rating_calculated == "no") {
        for (let row of frm.doc.appraiser_kra_table) {
          if ((row.appraisar_rating == "") | null) {
            frappe.msgprint("Please Give Your Rating first before save. . ");
          } else if ((row.appraisar_rating !== "") | null) {
            frappe.confirm(
              "Just a friendly reminder: Once you rate, you won't be able to change it. Are you sure you want to proceed?",
              () => {
                // action to perform if Yes is selected
                frm.trigger("calculate_appraiser_rating");
                frm.set_value("appraiser_rating_calculated", "yes");
                frm.save();
              },
              () => {
                // action to perform if No is selected
                frm.set_df_property("appraiser_kra_table", "read_only", 0);
              }
            );
          }
        }
      } else if (frm.doc.appraiser_rating_calculated == "yes") {
        frappe.msgprint({
          title: __("Notification"),
          indicator: "red",
          message: __("Your Ratings are already saved in our system."),
        });
      }
    } else if (session_emp_user === frm.doc.skip_user) {
      frm.trigger("calculate_skip_rating");
    }
    //     else if (session_emp_user === frm.doc.owner) {
    //     let session_emp_user = frappe.session.user;
    //     if (session_emp_user === frm.doc.owner) {
    //       const outstanding = 5;
    //       const exceeds_expectations = 4;
    //       const meets_expectations = 3;
    //       const needs_improvement = 2;
    //       const poor = 1;
    //       let sum_of_rating = 0;
    //       let total_weight = 0;
    //       let total_rating = 0;
    //       let overall_rating = 0.0;
    //       for (let row of frm.doc.emp_kra_table) {
    //         total_rating = total_rating + 5;
    //         total_weight = total_weight + row.weights;
    //         if (row.rating == "Outstanding") {
    //           sum_of_rating = sum_of_rating + outstanding;
    //         }
    //         if (row.rating == "Exceeds Expectations") {
    //           sum_of_rating = sum_of_rating + exceeds_expectations;
    //         }
    //         if (row.rating == "Meets Expectations") {
    //           sum_of_rating = sum_of_rating + meets_expectations;
    //         }
    //         if (row.rating == "Needs Improvement") {
    //           sum_of_rating = sum_of_rating + needs_improvement;
    //         }
    //         if (row.rating == "Poor") {
    //           sum_of_rating = sum_of_rating + poor;
    //         }
    //       }
    //       if (total_weight !== 50) {
    //         frappe.throw(__("Weightage should be 50"));
    //       } else if (total_weight == 50) {
    //         frm.set_value("total_weightage", total_weight);
    //         frm.set_value("sum_of_rating", sum_of_rating);
    //         frm.set_value("total_rating", total_rating);
    //         overall_rating = (sum_of_rating * 5) / total_rating;
    //         frm.set_value("overall_rating", overall_rating.toFixed(1));
    //         frm.set_value("employee_overall_rating", overall_rating.toFixed(1));
    //         console.log("Executing calculate_section_a");
    //       }
    //       if (frm.doc.employee_rating_fetched == "Not-Fetched") {
    //         for (let row of frm.doc.emp_kra_table) {
    //           let row1 = frm.add_child("appraiser_kra_table", {
    //             kras: row.kras,
    //             //weights: row.weights,
    //             rating: row.rating,
    //           });
    //           frm.refresh_field("appraiser_kra_table");
    //           frm.set_value("employee_rating_fetched", "Fetched");
    //         }
    //       } else if (frm.doc.employee_rating_fetched == "Fetched") {
    //         frappe.msgprint("Already fetched");
    //       }
    //     } else if (session_emp_user === frm.doc.appraiser_user_id) {
    //       frappe.throw("You don't have Enough Permission");
    //     } else if (session_emp_user === frm.doc.skip_user) {
    //       frappe.throw("You don't have Enough Permission");
    //     }
    //     // frm.set_value("sec_b_tech", frm.doc.technical_emp_rating);
    //     frm.trigger("calculate_section_b");
    //   }
  },

  // import_employee_rating: function (frm) {
  //   if (frm.doc.employee_rating_fetched == "Not-Fetched") {
  //     for (let row of frm.doc.emp_kra_table) {
  //       let row1 = frm.add_child("appraiser_kra_table", {
  //         kras: row.kras,
  //         weights: row.weights,
  //         rating: row.rating,
  //       });
  //       frm.refresh_field("appraiser_kra_table");
  //       frm.set_value("employee_rating_fetched", "Fetched");
  //     }
  //   } else if (frm.doc.employee_rating_fetched == "Fetched") {
  //     frappe.msgprint("Already fetched");
  //   }
  // },

  // after_save: function (frm) {
  //   if (frm.doc.employee_rating_fetched == "Not-Fetched") {
  //     for (let row of frm.doc.emp_kra_table) {
  //       let row1 = frm.add_child("appraiser_kra_table", {
  //         kras: row.kras,
  //         //weights: row.weights,
  //         rating: row.rating,
  //       });
  //       frm.refresh_field("appraiser_kra_table");
  //       frm.set_value("employee_rating_fetched", "Fetched");
  //     }
  //   } else if (frm.doc.employee_rating_fetched == "Fetched") {
  //     frappe.msgprint("Already fetched");
  //   }
  // },

  calculate_appraiser_rating: function (frm) {
    let session_emp_user = frappe.session.user;
    // frappe.msgprint("logged in id : " + session_emp_user);
    if (session_emp_user === frm.doc.owner) {
      frappe.throw("You dont have Enough Permission");
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      frappe.msgprint("Appraiser Matched");
      const outstanding = 5;
      const exceeds_expectations = 4;
      const meets_expectations = 3;
      const needs_improvement = 2;
      const poor = 1;
      let app_sum_of_rating = 0;
      let app_total_rating = 0;
      let app_overall_rating = 0.0;
      for (let row1 of frm.doc.appraiser_kra_table) {
        app_total_rating = app_total_rating + 5;
        if (row1.appraisar_rating == "Outstanding") {
          app_sum_of_rating = app_sum_of_rating + outstanding;
        }
        if (row1.appraisar_rating == "Exceeds Expectations") {
          app_sum_of_rating = app_sum_of_rating + exceeds_expectations;
        }
        if (row1.appraisar_rating == "Meets Expectations") {
          app_sum_of_rating = app_sum_of_rating + meets_expectations;
        }
        if (row1.appraisar_rating == "Needs Improvement") {
          app_sum_of_rating = app_sum_of_rating + needs_improvement;
        }
        if (row1.appraisar_rating == "Poor") {
          app_sum_of_rating = app_sum_of_rating + poor;
        }
      }
      app_overall_rating = (app_sum_of_rating / app_total_rating) * 5;
      // frappe.msgprint("Appraiser Rating : " + app_overall_rating.toFixed(1));
      frm.set_value("appraiser_overall_rating", app_overall_rating.toFixed(1));

      //* fetching appraiser rating to skip rating table

      let session_emp_user = frappe.session.user;
      if (session_emp_user === frm.doc.appraiser_user_id) {
        frm.clear_table("skip_kra_table");
        for (let row of frm.doc.appraiser_kra_table) {
          let row1 = frm.add_child("skip_kra_table", {
            emp_kra: row.kras,
            emp_rating: row.rating,
            reproting_rating: row.appraisar_rating,
          });
          frm.refresh_field("skip_kra_table");
        }
      }
    }
  },

  refresh: function (frm) {
    let session_emp_user = frappe.session.user;

    //frappe.msgprint("logged in id : " + session_emp_user);

    if (session_emp_user === frm.doc.owner) {
      frappe.msgprint("Employee Matched");
      frm.set_df_property("emp_kra_table", "read_only", 0);
      frm.set_df_property("appraiser_kra_table", "read_only", 1);
      frm.set_df_property("skip_kra_table", "read_only", 1);

      frm.toggle_enable("skip_confirmation_status", 0);
      frm.toggle_display("calculate_skip_rating", 0);

      //*<disable or read only Appraiser Section B>
      frm.toggle_enable("sec_b_tech_emp_rating", 0);
      frm.toggle_enable("sec_b_tech_app_rating", 0);

      //*</disable or read only Appraiser Section B>

      //*<display Employee rating and appraiser rating>
      var employee_rating = frm.doc.overall_rating;
      var appraiser_rating = frm.doc.appraiser_overall_rating;

      // Set the rating color based on the comparison of the two ratings
      var rating_color = "";
      if (employee_rating && appraiser_rating) {
        rating_color =
          appraiser_rating < employee_rating
            ? " #ff8c8c"
            : appraiser_rating == employee_rating
            ? "#bfe3b4"
            : "";
      } else {
        rating_color = "blue";
      }

      if (employee_rating || appraiser_rating) {
        // Display the card only if at least one rating is not null
        var card_html =
          "<div style='display: flex; flex-wrap: wrap; justify-content: space-around; align-items: center;'>";

        if (employee_rating && appraiser_rating) {
          // Display both ratings if both are not null
          card_html +=
            "<div style='background-color: " +
            rating_color +
            "; color: black; padding: 10px; border-radius: 10px; box-shadow: 5px 5px 5px grey; margin: 10px;'>" +
            "<h4 style='margin-top: 0;'>Employee Rating</h4>" +
            "<p style='font-size: 24px;'>" +
            employee_rating +
            "</p>" +
            "</div>" +
            "<div style='background-color: " +
            rating_color +
            "; color: black; padding: 10px; border-radius: 10px; box-shadow: 5px 5px 5px grey; margin: 10px;'>" +
            "<h4 style='margin-top: 0;'>Appraiser Rating</h4>" +
            "<p style='font-size: 24px;'>" +
            appraiser_rating +
            "</p>" +
            "</div>";
        } else if (employee_rating) {
          // Display only Employee Rating if Appraiser Rating is null
          card_html +=
            "<div style='background-color: #bfe3b4; color: black; padding: 10px; border-radius: 10px; box-shadow: 5px 5px 5px grey; margin: 10px;'>" +
            "<h4 style='margin-top: 0;'>Employee Rating</h4>" +
            "<p style='font-size: 24px;'>" +
            employee_rating +
            "</p>" +
            "</div>";
        } else {
          // Display only Appraiser Rating if Employee Rating is null
          card_html +=
            "<div style='background-color: blue; color: black; padding: 10px; border-radius: 10px; box-shadow: 5px 5px 5px grey; margin: 10px;'>" +
            "<h4 style='margin-top: 0;'>Appraiser Rating</h4>" +
            "<p style='font-size: 24px;'>" +
            appraiser_rating +
            "</p>" +
            "</div>";
        }

        card_html += "</div>";

        frm.set_intro(card_html);
      }
      //*</display Employee rating and appraiser rating>

      if (frm.doc.appraiser_overall_rating == null) {
        //*<Activate (Sent to Appraiser) button when employee want to sent their rating to appraiser>
        frm.add_custom_button(
          __("Send to Appraiser"),
          function () {
            if (frm.doc.employee_rating_fetched == "Fetched") {
              frappe.msgprint(
                "Your Rating has been Already Sent to Appraiser !!"
              );
            } else if (frm.doc.employee_rating_fetched == "Not-Fetched") {
              frm.trigger("send_to_appraiser");
              frm.save();
              frappe.msgprint("successfully sent to your Appraiser");
            }
          },
          __("Send")
        );
        //*</Activate (Sent to Appraiser) button when employee want to sent their rating to appraiser>
      } else {
        //* <Activate skip level button when appraiser give their rating to employee>
        frm.add_custom_button(
          __("Satisfied"),
          function () {
            frappe.confirm(
              "Are you sure you want to proceed with Appraiser Rating?",
              () => {
                // action to perform if Yes is selected
                frappe.msgprint("Appraiser Rating has been accepted ");
              },
              () => {
                // action to perform if No is selected
              }
            );
          },
          __("Appraiser Rating")
        );
        frm.add_custom_button(
          __("Not-Satisfied"),
          function () {
            frm.trigger("activate_skip");
          },
          __("Appraiser Rating")
        );
      } //* </Activate skip level button when appraiser give their rating to employee>
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      frappe.msgprint("Appraiser Matched");
      frm.toggle_enable("skip_confirmation_status", 0);
      frm.toggle_display("emp_reason", 0);
      frm.toggle_display("calculate_skip_rating", 0);

      //*<disable or read only Appraiser Section B>
      frm.toggle_enable("employee_section_b_table", 1);

      //*</disable or read only Appraiser Section B>

      for (let row of frm.doc.appraiser_kra_table) {
        if ((row.appraisar_rating == "") | null) {
          frappe.msgprint("Empty Appraiser Rating");
        } else if ((row.appraisar_rating !== "") | null) {
          frm.set_df_property("appraiser_kra_table", "read_only", 1);
        }
      }

      frm.set_df_property("emp_kra_table", "read_only", 1);
      // frm.set_df_property("appraiser_kra_table", "read_only", 0);
      frm.set_df_property("skip_kra_table", "read_only", 1);
      frm.fields_dict["appraiser_kra_table"].grid.wrapper
        .find(".grid-remove-all-rows")
        .hide();
      frm.fields_dict["appraiser_kra_table"].grid.wrapper
        .find(".grid-remove-rows")
        .hide();
      frm.fields_dict["appraiser_kra_table"].grid.wrapper
        .find(".grid-add-row")
        .hide();
    } else if (session_emp_user === frm.doc.skip_user) {
      frappe.msgprint("SKIP Matched");
      if (frm.doc.skip_confirmation_status == "" || null) {
        //frappe.msgprint("Confirmation not set");
        frm.toggle_enable("skip_confirmation_status", 1);
      } else {
        // frappe.msgprint("Confirmation set");
        frm.toggle_enable("skip_confirmation_status", 0);
      }

      frm.toggle_display("skip_confirmation_status", 1);

      frm.set_value("skip_emp_overall_rating", frm.doc.overall_rating);
      frm.set_value(
        "skip_appraiser_overall_rating",
        frm.doc.appraiser_overall_rating
      );
      frm.set_df_property("emp_kra_table", "read_only", 1);
      frm.set_df_property("appraiser_kra_table", "read_only", 1);
      frm.set_df_property("skip_kra_table", "read_only", 0);
      frm.fields_dict["skip_kra_table"].grid.wrapper
        .find(".grid-add-row")
        .hide();
      frm.fields_dict["skip_kra_table"].grid.wrapper
        .find(".grid-remove-all-rows")
        .hide();
      frm.fields_dict["skip_kra_table"].grid.wrapper
        .find(".grid-remove-rows")
        .hide();
    }

    //* <skip tab hide /unhide depends on employee rating status>
    if (frm.doc.employee_status == "Satisfied") {
      frm.toggle_display("skip_kra_sec", false);
      frm.toggle_display("calculate_skip_rating", false);
      frm.toggle_display("emp_skip_msg", true);
    } else if (frm.doc.employee_status == "Not-Satisfied") {
      frm.toggle_display("skip_kra_sec", true);
      frm.toggle_display("calculate_skip_rating", true);
      frm.toggle_display("emp_skip_msg", false);
    }
    //* </skip tab hide /unhide depends on employee rating status>
  },

  calculate_skip_rating: function (frm) {
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.owner) {
      frappe.throw("You don't have Enough Permission");
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      frappe.throw("You don't have Enough Permission");
    } else if (session_emp_user === frm.doc.skip_user) {
      frappe.msgprint("Skip Matched");

      const outstanding = 5;
      const exceeds_expectations = 4;
      const meets_expectations = 3;
      const needs_improvement = 2;
      const poor = 1;
      let skip_sum_of_rating = 0;
      let skip_total_rating = 0;
      let skip_overall_rating = 0.0;
      for (let row1 of frm.doc.skip_kra_table) {
        skip_total_rating = skip_total_rating + 5;
        if (row1.skip_rating == "Outstanding") {
          skip_sum_of_rating = skip_sum_of_rating + outstanding;
        }
        if (row1.skip_rating == "Exceeds Expectations") {
          skip_sum_of_rating = skip_sum_of_rating + exceeds_expectations;
        }
        if (row1.skip_rating == "Meets Expectations") {
          skip_sum_of_rating = skip_sum_of_rating + meets_expectations;
        }
        if (row1.skip_rating == "Needs Improvement") {
          skip_sum_of_rating = skip_sum_of_rating + needs_improvement;
        }
        if (row1.skip_rating == "Poor") {
          skip_sum_of_rating = skip_sum_of_rating + poor;
        }
      }
      skip_overall_rating = (skip_sum_of_rating / skip_total_rating) * 5;
      // frappe.msgprint("Appraiser Rating : " + skip_overall_rating.toFixed(1));
      frm.set_value("skip_overall_rating", skip_overall_rating.toFixed(1));
    }
  },
  //* <Calculate Section B using button>
  calculate_section_b: function (frm) {
    console.log("Executing calculate_section_b");
    frm.clear_table("employee_section_b_table");
    if ((frm.doc.technical_emp_rating !== "") | null) {
      let row1 = frm.add_child("employee_section_b_table", {
        employee_data: "Technical & Functional knowledge",
        employee_rating: frm.doc.technical_emp_rating,
      });
    }

    if ((frm.doc.thought_emp_rating !== "") | null) {
      let row2 = frm.add_child("employee_section_b_table", {
        employee_data: "Thought leadership-holistic and strategic perspective",
        employee_rating: frm.doc.thought_emp_rating,
      });
    }

    if ((frm.doc.people_emp_rating !== "") | null) {
      let row3 = frm.add_child("employee_section_b_table", {
        employee_data: "People Development",
        employee_rating: frm.doc.people_emp_rating,
      });
    }

    if ((frm.doc.managing_emp_rating !== "") | null) {
      let row4 = frm.add_child("employee_section_b_table", {
        employee_data: "Managing relationships – collaboration",
        employee_rating: frm.doc.managing_emp_rating,
      });
    }
    if ((frm.doc.decision_emp_rating !== "") | null) {
      let row5 = frm.add_child("employee_section_b_table", {
        employee_data: "Decision making & problem solving",
        employee_rating: frm.doc.decision_emp_rating,
      });
    }
    if ((frm.doc.planning_emp_rating !== "") | null) {
      let row6 = frm.add_child("employee_section_b_table", {
        employee_data: "Planning",
        employee_rating: frm.doc.planning_emp_rating,
      });
    }
    if ((frm.doc.leadership_emp_rating !== "") | null) {
      let row7 = frm.add_child("employee_section_b_table", {
        employee_data: "Leadership Presence",
        employee_rating: frm.doc.leadership_emp_rating,
      });
    }
    if ((frm.doc.humility_emp_rating !== "") | null) {
      let row8 = frm.add_child("employee_section_b_table", {
        employee_data: "Humility to learn",
        employee_rating: frm.doc.humility_emp_rating,
      });
    }
    if ((frm.doc.strategic_emp_rating !== "") | null) {
      let row9 = frm.add_child("employee_section_b_table", {
        employee_data: "Strategic Thinking",
        employee_rating: frm.doc.strategic_emp_rating,
      });
    }
    if ((frm.doc.result_orientation_emp_rating !== "") | null) {
      let row10 = frm.add_child("employee_section_b_table", {
        employee_data: "Result Orientation",
        employee_rating: frm.doc.result_orientation_emp_rating,
      });
    }
    if ((frm.doc.personal_and_interpersonal_emp_rating !== "") | null) {
      let row11 = frm.add_child("employee_section_b_table", {
        employee_data: "Personal & Interpersonal Effectiveness",
        employee_rating: frm.doc.personal_and_interpersonal_emp_rating,
      });
    }

    if ((frm.doc.people_mngmnt_emp_rating !== "") | null) {
      let row12 = frm.add_child("employee_section_b_table", {
        employee_data: "People Management",
        employee_rating: frm.doc.people_mngmnt_emp_rating,
      });
    }

    if ((frm.doc.team_work_emp_rating !== "") | null) {
      let row13 = frm.add_child("employee_section_b_table", {
        employee_data: "Team Work",
        employee_rating: frm.doc.team_work_emp_rating,
      });
    }

    if ((frm.doc.initiative_emp_rating !== "") | null) {
      let row14 = frm.add_child("employee_section_b_table", {
        employee_data: "Initiative",
        employee_rating: frm.doc.initiative_emp_rating,
      });
    }
    if ((frm.doc.communication_emp_rating !== "") | null) {
      let row15 = frm.add_child("employee_section_b_table", {
        employee_data: "Communication",
        employee_rating: frm.doc.communication_emp_rating,
      });
    }

    frm.refresh_field("employee_section_b_table");

    const outstanding = 5;
    const exceeds_expectations = 4;
    const meets_expectations = 3;
    const needs_improvement = 2;
    const poor = 1;
    let section_b_sum_of_rating = 0;
    let section_b_total_rating = 0;
    let section_b_overall_rating = 0.0;

    for (let row1 of frm.doc.employee_section_b_table) {
      section_b_total_rating = section_b_total_rating + 5;
      if (row1.employee_rating == "Outstanding") {
        section_b_sum_of_rating = section_b_sum_of_rating + outstanding;
      }
      if (row1.employee_rating == "Exceeds Expectations") {
        section_b_sum_of_rating =
          section_b_sum_of_rating + exceeds_expectations;
      }
      if (row1.employee_rating == "Meets Expectations") {
        section_b_sum_of_rating = section_b_sum_of_rating + meets_expectations;
      }
      if (row1.employee_rating == "Needs Improvement") {
        section_b_sum_of_rating = section_b_sum_of_rating + needs_improvement;
      }
      if (row1.employee_rating == "Poor") {
        section_b_sum_of_rating = section_b_sum_of_rating + poor;
      }
    }
    section_b_overall_rating =
      (section_b_sum_of_rating / section_b_total_rating) * 5;
    // frappe.msgprint("Appraiser Rating : " + skip_overall_rating.toFixed(1));
    frm.set_value(
      "overall_section_b_rating",
      section_b_overall_rating.toFixed(1)
    );
  },
  //* </Calculate Section B using button>

  //* <Calculate Section A using button>
  calculate_section_a: function (frm) {
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.owner) {
      const outstanding = 5;
      const exceeds_expectations = 4;
      const meets_expectations = 3;
      const needs_improvement = 2;
      const poor = 1;
      let sum_of_rating = 0;
      let total_weight = 0;
      let total_rating = 0;
      let overall_rating = 0.0;
      for (let row of frm.doc.emp_kra_table) {
        total_rating = total_rating + 5;

        total_weight = total_weight + row.weights;
        if (row.rating == "Outstanding") {
          sum_of_rating = sum_of_rating + outstanding;
        }
        if (row.rating == "Exceeds Expectations") {
          sum_of_rating = sum_of_rating + exceeds_expectations;
        }
        if (row.rating == "Meets Expectations") {
          sum_of_rating = sum_of_rating + meets_expectations;
        }
        if (row.rating == "Needs Improvement") {
          sum_of_rating = sum_of_rating + needs_improvement;
        }
        if (row.rating == "Poor") {
          sum_of_rating = sum_of_rating + poor;
        }
      }

      if (total_weight !== 50) {
        frappe.throw(__("Weightage should be 50"));
      } else if (total_weight == 50) {
        frm.set_value("total_weightage", total_weight);
        frm.set_value("sum_of_rating", sum_of_rating);
        frm.set_value("total_rating", total_rating);

        overall_rating = (sum_of_rating * 5) / total_rating;
        frm.set_value("overall_rating", overall_rating.toFixed(1));
        frm.set_value("employee_overall_rating", overall_rating.toFixed(1));
        console.log("Executing calculate_section_a");
      }
    } else if (session_emp_user === frm.doc.appraiser_user_id) {
      frappe.throw("You don't have Enough Permission");
    } else if (session_emp_user === frm.doc.skip_user) {
      frappe.throw("You don't have Enough Permission");
    }

    //*<fetching employee section b rating into appraiser section b rating>

    // frm.set_value("sec_b_tech", frm.doc.technical_emp_rating);
    // frm.set_value("sec_b_tech_comment", frm.doc.technical_emp_comments);

    //*</fetching employee section b rating into appraiser section b rating>
  }, //*</Calculate Section A using button>

  //* <Send Employee Section A and B Rating to Appraiser Tab>
  send_to_appraiser: function (frm) {
    let session_emp_user = frappe.session.user;
    if (session_emp_user === frm.doc.appraiser_user_id) {
      frm.trigger("calculate_appraiser_rating");
    } else if (session_emp_user === frm.doc.skip_user) {
      frm.trigger("calculate_skip_rating");
    } else if (session_emp_user === frm.doc.owner) {
      let session_emp_user = frappe.session.user;
      if (session_emp_user === frm.doc.owner) {
        const outstanding = 5;
        const exceeds_expectations = 4;
        const meets_expectations = 3;
        const needs_improvement = 2;
        const poor = 1;
        let sum_of_rating = 0;
        let total_weight = 0;
        let total_rating = 0;
        let overall_rating = 0.0;
        for (let row of frm.doc.emp_kra_table) {
          total_rating = total_rating + 5;

          total_weight = total_weight + row.weights;
          if (row.rating == "Outstanding") {
            sum_of_rating = sum_of_rating + outstanding;
          }
          if (row.rating == "Exceeds Expectations") {
            sum_of_rating = sum_of_rating + exceeds_expectations;
          }
          if (row.rating == "Meets Expectations") {
            sum_of_rating = sum_of_rating + meets_expectations;
          }
          if (row.rating == "Needs Improvement") {
            sum_of_rating = sum_of_rating + needs_improvement;
          }
          if (row.rating == "Poor") {
            sum_of_rating = sum_of_rating + poor;
          }
        }

        if (total_weight !== 50) {
          frappe.throw(__("Weightage should be 50"));
        } else if (total_weight == 50) {
          frm.set_value("total_weightage", total_weight);
          frm.set_value("sum_of_rating", sum_of_rating);
          frm.set_value("total_rating", total_rating);

          overall_rating = (sum_of_rating * 5) / total_rating;
          frm.set_value("overall_rating", overall_rating.toFixed(1));
          frm.set_value("employee_overall_rating", overall_rating.toFixed(1));
          console.log("Executing calculate_section_a");
        }

        if (frm.doc.employee_rating_fetched == "Not-Fetched") {
          for (let row of frm.doc.emp_kra_table) {
            let row1 = frm.add_child("appraiser_kra_table", {
              kras: row.kras,
              //weights: row.weights,
              rating: row.rating,
            });
            frm.refresh_field("appraiser_kra_table");
            frm.set_value("employee_rating_fetched", "Fetched");
          }
        } else if (frm.doc.employee_rating_fetched == "Fetched") {
          frappe.msgprint("Already fetched");
        }
      } else if (session_emp_user === frm.doc.appraiser_user_id) {
        frappe.throw("You don't have Enough Permission");
      } else if (session_emp_user === frm.doc.skip_user) {
        frappe.throw("You don't have Enough Permission");
      }

      //*<Executing section b calculation of employee>
      frm.trigger("calculate_section_b");
      //*<Executing section b calculation of employee>

      //*<send Employee Section B Rating to Appraiser Tab in Section B>
      frm.set_value("sec_b_tech_emp_rating", frm.doc.technical_emp_rating);
      frm.set_value("sec_b_thought_emp_rating", frm.doc.thought_emp_rating);
      frm.set_value("sec_b_people_emp_rating", frm.doc.people_emp_rating);

      //*</send Employee Section B Rating to Appraiser Tab in Section B>
    }
  }, //* <Send Employee Section A and B Rating to Appraiser Tab>

  //*<Employee status (Satisfied/Not-Satisfied) to hide /unhide skip section>
  employee_status: function (frm) {
    if (frm.doc.employee_status == "Satisfied") {
      frm.toggle_display("skip_kra_sec", false);
      frm.toggle_display("calculate_skip_rating", false);
      frm.toggle_display("emp_skip_msg", true);
    } else if (frm.doc.employee_status == "Not-Satisfied") {
      frm.toggle_display("skip_kra_sec", true);
      frm.toggle_display("calculate_skip_rating", true);
      frm.toggle_display("emp_skip_msg", false);
    }
  }, //*</Employee status (Satisfied/Not-Satisfied) to hide /unhide skip section>

  //*<Activate SKIP LEVEL if employee not satisfied with manager rating>
  activate_skip: function (frm) {
    let d = new frappe.ui.Dialog({
      title:
        "Your satisfaction is important to us. Request a SKIP level rating if you're not happy.",
      fields: [
        {
          label: "Please explain, why are you not satisfied?",
          fieldname: "emp_reason",
          fieldtype: "Text Editor",
        },
      ],
      primary_action_label: "Submit",
      primary_action(values) {
        let emp_reason = d.get_value("emp_reason");
        if (emp_reason) {
          frappe.confirm(
            "Do you want to continue?",
            () => {
              // action to perform if Yes is selected

              frm.set_value("employee_status", "Not-Satisfied");
              frm.set_value("emp_reason", emp_reason);
              d.hide();
            },
            () => {
              // action to perform if No is selected
            }
          );
        } else {
          frappe.msgprint("Please enter a reason");
        }
      },
    });
    d.show();
  }, //*</Activate SKIP LEVEL if employee not satisfied with manager rating>

  //*<Button to Calculate Section B from Appraiser tab>
  btn_calculate_app_section_b: function (frm) {
    frappe.msgprint("Appraiser Section B Calculated !!");

    const outstanding = 5;
    const exceeds_expectations = 4;
    const meets_expectations = 3;
    const needs_improvement = 2;
    const poor = 1;
    let section_b_sum_of_rating = 0;
    let section_b_total_rating = 0;
    let section_b_overall_rating = 0.0;

    for (let row1 of frm.doc.employee_section_b_table) {
      section_b_total_rating = section_b_total_rating + 5;
      if (row1.appraiser_rating == "Outstanding") {
        section_b_sum_of_rating = section_b_sum_of_rating + outstanding;
      }
      if (row1.appraiser_rating == "Exceeds Expectations") {
        section_b_sum_of_rating =
          section_b_sum_of_rating + exceeds_expectations;
      }
      if (row1.appraiser_rating == "Meets Expectations") {
        section_b_sum_of_rating = section_b_sum_of_rating + meets_expectations;
      }
      if (row1.appraiser_rating == "Needs Improvement") {
        section_b_sum_of_rating = section_b_sum_of_rating + needs_improvement;
      }
      if (row1.appraiser_rating == "Poor") {
        section_b_sum_of_rating = section_b_sum_of_rating + poor;
      }
    }
    section_b_overall_rating =
      (section_b_sum_of_rating / section_b_total_rating) * 5;
    frappe.msgprint("Rating : " + section_b_overall_rating.toFixed(1));
    // frm.set_value(
    //   "overall_section_b_rating",
    //   section_b_overall_rating.toFixed(1)
    // );
  },
  //*</Button to Calculate Section B from Appraiser tab>
});
